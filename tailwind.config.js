/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 扫描 src 文件夹下所有 js, jsx, ts, tsx 文件
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        secondary: '#40A9FF',
        success: '#52C41A',
        warning: '#FAAD14',
        error: '#F5222D',
      }
    },
  },
  plugins: [],
}