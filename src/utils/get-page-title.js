import defaultSettings from '@/settings'

const title = defaultSettings.title || '母婴用品购物平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
