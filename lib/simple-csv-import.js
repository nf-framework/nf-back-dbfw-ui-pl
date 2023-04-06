import { dbapi } from '@nfjs/back';
import { getUnit } from '@nfjs/back-dbfw';

function csvParse(csvString, delimiterString){
    const delimiter = delimiterString || ',';
    const exp = new RegExp(`(\\${delimiter}|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\${delimiter}\\r\\n]*))`,'gi');
    const result = [[]];
    let match = null
    while ((match = exp.exec(csvString))) {
        let matchedDelimiter = match[1]
        if (matchedDelimiter.length && matchedDelimiter !== delimiter) {
            result.push([])
        }
        let matchedValue
        if (match[2]) {
            matchedValue = match[2].replace(new RegExp('""', 'g'), '"');
        } else {
            matchedValue = match[3];
        }
        result[result.length - 1].push(matchedValue)
    }
    return result
}

export async function process(connect, data, unit, uKey, hKey) {
    for (let row of data) {
        try {
            const exists = await connect.broker(`${unit.code}.find`, { [uKey]: row[uKey] });
            if (exists?.data?.length > 1) throw new Error(`Найдено несколько записей с таким ключом`);
            const pKeyValue = exists?.data?.[0]?.[unit.pkField];
            if (pKeyValue) row[unit.pkField] = pKeyValue;
            await connect.broker(`${unit.code}.mod`, row);
        } catch(e) {
            throw new Error(`Ошибка загрузки строки с ${uKey}=[${row[uKey]}]: ${e.message}`);
        }
    }
}

export async function handle(context) {
    let connect;
    try {
        const { dataString, delimiter, unit, uKey, hKey } = context?.body?.args;
        const data = csvParse(dataString, delimiter);
        const header = data.shift();
        const dataAsObjects = data.map(dt => {
            const row = {};
            header.forEach((h,i) => { row[h] = dt[i]});
            return row;
        });
        connect = await dbapi.getConnect(context);
        const unitObj = await getUnit(connect._connect, unit);
        await connect.begin();
        await process(connect, dataAsObjects, unitObj, uKey, hKey);
        await connect.commit();
        context.send({ data:{ success: true } });
    } catch(e) {
        if (connect) await connect.rollback();
        context.send({ data: { success: false, error: e.message } });
    } finally {
        if (connect) connect.release();
    }
}