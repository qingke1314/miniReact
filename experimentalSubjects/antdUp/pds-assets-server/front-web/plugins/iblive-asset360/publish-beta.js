const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const formatDateTime = function (date = new Date()) {
  // 提取日期时间各组成部分
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 组合成 yyyymmddHHMMss 格式
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};
try {
  console.log(`Working directory: ${process.cwd()}`);

  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found at ${packageJsonPath}`);
  }
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const mainVersion = pkg.version.split('-')[0];
  const timestamp = formatDateTime(new Date());
  const newVersion = `${mainVersion}-beta.${timestamp}`;

  console.log(`Updating version from ${pkg.version} to ${newVersion}...`);
  execSync(
    `pnpm version ${newVersion} --allow-same-version --no-git-tag-version`,
    {
      stdio: 'inherit',
    },
  );

  console.log('Building the package...');
  execSync('pnpm run build', { stdio: 'inherit' });

  console.log('Publishing to registry...');
  execSync(
    'pnpm publish --registry=https://oss.apexsoft.com.cn/repository/npm-hosted/ --tag beta --no-git-checks',

    { stdio: 'inherit' },
  );

  console.log(`Successfully published version ${newVersion}`);
} catch (error) {
  console.error('An error occurred during the publishing process:', error);
  process.exit(1);
}
