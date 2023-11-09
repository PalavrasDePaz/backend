export const caseWhenBoolean = (table: string, column: string) => `
(CASE WHEN ${table}.\`${column}\` = 1 THEN 'SIM' WHEN ${table}.\`${column}\` = 0 THEN 'NAO' ELSE NULL END) AS '${column}'
`;
