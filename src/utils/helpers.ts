// src/utils/helpers.ts

/**
 * Converts a Unix timestamp to a date string in the format 'YYYY-MM-DD'
 * @param timestamp Unix timestamp in seconds
 * @returns Date string in 'YYYY-MM-DD' format
 */
export function timestampToDateString(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
  }
  
  /**
   * Calculates the average of an array of numbers
   * @param numbers Array of numbers
   * @returns The average of the numbers
   */
  export function calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return sum / numbers.length;
  }
  
  /**
   * Finds the most frequent element in an array
   * @param arr Array of elements
   * @returns The most frequent element
   */
  export function findMostFrequent<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined;
  
    const frequencyMap = new Map<T, number>();
    let maxFrequency = 0;
    let mostFrequent: T | undefined;
  
    for (const item of arr) {
      const frequency = (frequencyMap.get(item) || 0) + 1;
      frequencyMap.set(item, frequency);
  
      if (frequency > maxFrequency) {
        maxFrequency = frequency;
        mostFrequent = item;
      }
    }
  
    return mostFrequent;
  }
  
  /**
   * Rounds a number to a specified number of decimal places
   * @param num Number to round
   * @param decimals Number of decimal places (default: 2)
   * @returns Rounded number
   */
  export function roundToDecimals(num: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }
  
  /**
   * Checks if a value is within a specified range (inclusive)
   * @param value Value to check
   * @param min Minimum value of the range
   * @param max Maximum value of the range
   * @returns True if the value is within the range, false otherwise
   */
  export function isWithinRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }