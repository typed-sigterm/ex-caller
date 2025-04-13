/** 从 Excel 文件中读取每行第一列的内容，去除空元素 */
export async function readExcelLines(file: File): Promise<string[]> {
  const { read, utils } = await import('@/utils/xlsx-wrapper');

  const workbook = read(await file.arrayBuffer(), { type: 'array' });
  if (workbook.SheetNames[0] == null)
    return [];
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]!;
  const rows = utils.sheet_to_json(worksheet, {
    blankrows: false,
    header: 1,
    skipHidden: true,
  }) as unknown[][];

  return (rows // 去除非字符串，去除空元素
    .filter(v => typeof v[0] === 'string') as string[][])
    .map(v => (v[0] || '').trim())
    .filter(Boolean);
}
