/**
 * Validate Chilean RUT (Rol Único Tributario)
 */
export function validateRUT(rut: string): boolean {
  // Remove dots and hyphens
  const cleanRUT = rut.replace(/\./g, '').replace(/-/g, '');
  
  // Check format: 7-8 digits + 1 check digit
  if (!/^\d{7,8}[\dkK]$/.test(cleanRUT)) {
    return false;
  }
  
  // Extract number and check digit
  const rutNumber = cleanRUT.slice(0, -1);
  const checkDigit = cleanRUT.slice(-1).toUpperCase();
  
  // Calculate expected check digit
  const expectedCheckDigit = calculateRUTCheckDigit(rutNumber);
  
  return checkDigit === expectedCheckDigit;
}

/**
 * Calculate RUT check digit
 */
function calculateRUTCheckDigit(rutNumber: string): string {
  let sum = 0;
  let multiplier = 2;
  
  // Calculate sum from right to left
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const checkDigit = 11 - remainder;
  
  if (checkDigit === 11) return '0';
  if (checkDigit === 10) return 'K';
  return checkDigit.toString();
}

/**
 * Format RUT with dots and hyphen
 * Example: 12345678-9 -> 12.345.678-9
 */
export function formatRUT(rut: string): string {
  // Remove existing formatting
  const cleanRUT = rut.replace(/\./g, '').replace(/-/g, '');
  
  // Validate
  if (!validateRUT(cleanRUT)) {
    throw new Error('Invalid RUT');
  }
  
  // Extract parts
  const rutNumber = cleanRUT.slice(0, -1);
  const checkDigit = cleanRUT.slice(-1).toUpperCase();
  
  // Add thousand separators
  const formattedNumber = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedNumber}-${checkDigit}`;
}

/**
 * Clean RUT (remove dots and hyphens)
 */
export function cleanRUT(rut: string): string {
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
}

