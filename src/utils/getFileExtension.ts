export function getFileExtension(path: string): string {
  const parts = path.split('.');
  if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) {
    // В случае, если точек нет или первый символ - точка
    return '';
  }
  // Последняя часть пути (после последней точки)
  const extension = parts.pop()!;
  // Проверяем, если расширение состоит из нескольких частей, например, .js.gz
  if (extension === 'gz' && parts.length >= 2) {
    return parts.pop()! + '.gz';
  }
  return extension;
}