/**
 * Convierte un array de objetos a formato CSV
 */
export const convertToCSV = (data: any[], columns: { key: string; header: string }[]): string => {
  if (data.length === 0) return '';

  // Encabezados
  const headers = columns.map(col => col.header).join(',');
  
  // Filas
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key];
      
      // Manejar valores anidados (ej: paciente.firstName)
      if (col.key.includes('.')) {
        const keys = col.key.split('.');
        value = keys.reduce((obj, key) => obj?.[key], item);
      }
      
      // Manejar objetos complejos
      if (typeof value === 'object' && value !== null) {
        if (value.firstName && value.lastName) {
          value = `${value.firstName} ${value.lastName}`;
        } else {
          value = JSON.stringify(value);
        }
      }
      
      // Manejar fechas
      if (value instanceof Date) {
        value = value.toLocaleDateString('es-CL');
      } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        value = new Date(value).toLocaleDateString('es-CL');
      }
      
      // Escapar comillas y comas
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""');
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          value = `"${value}"`;
        }
      }
      
      return value ?? '';
    }).join(',');
  }).join('\n');
  
  return `${headers}\n${rows}`;
};

/**
 * Descarga un archivo CSV
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  // Agregar BOM para soporte de caracteres especiales en Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Crear link de descarga
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpiar URL
  URL.revokeObjectURL(url);
};

/**
 * Exporta datos a CSV con nombre de archivo automático
 */
export const exportToCSV = (
  data: any[], 
  columns: { key: string; header: string }[],
  baseFilename: string
): void => {
  const csvContent = convertToCSV(data, columns);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${baseFilename}_${timestamp}.csv`;
  
  downloadCSV(csvContent, filename);
};

