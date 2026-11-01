import type { ExpressiveCodeConfig, LicenseConfig, NavBarConfig, ProfileConfig, SiteConfig } from './types/config';
export const siteConfig: SiteConfig = {
 title: '文章', subtitle: '', lang: 'zh_CN',
 themeColor: { hue: 285, fixed: true },
 banner: { enable: false, src: '', position: 'center', credit: { enable: false, text: '', url: '' } },
 toc: { enable: true, depth: 2 }, favicon: [{ src: '/sprout.svg', sizes: 'any' }],
};
export const navBarConfig: NavBarConfig = { links: [
 { name: '文章', url: '/', external: false }, { name: '关于', url: '/about/', external: false },
] };
export const profileConfig: ProfileConfig = { avatar: '', name: '', bio: '', links: [] };
export const licenseConfig: LicenseConfig = { enable: false, name: '', url: '' };
export const expressiveCodeConfig: ExpressiveCodeConfig = { theme: 'github-light' };
