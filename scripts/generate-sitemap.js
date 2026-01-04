import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SITE_URL = 'https://fluxcast-1cbb7.web.app'
const PUBLIC_DIR = path.join(__dirname, '../public')

// IPTV-org API endpoints
const API_CHANNELS = 'https://iptv-org.github.io/api/channels.json'
const API_STREAMS = 'https://iptv-org.github.io/api/streams.json'

// Country code to full name mapping (ISO 3166-1 alpha-2)
const COUNTRY_NAMES = {
  'AD': 'Andorra', 'AE': 'United Arab Emirates', 'AF': 'Afghanistan', 'AG': 'Antigua and Barbuda',
  'AI': 'Anguilla', 'AL': 'Albania', 'AM': 'Armenia', 'AO': 'Angola', 'AQ': 'Antarctica',
  'AR': 'Argentina', 'AS': 'American Samoa', 'AT': 'Austria', 'AU': 'Australia', 'AW': 'Aruba',
  'AX': 'Åland Islands', 'AZ': 'Azerbaijan', 'BA': 'Bosnia and Herzegovina', 'BB': 'Barbados',
  'BD': 'Bangladesh', 'BE': 'Belgium', 'BF': 'Burkina Faso', 'BG': 'Bulgaria', 'BH': 'Bahrain',
  'BI': 'Burundi', 'BJ': 'Benin', 'BL': 'Saint Barthélemy', 'BM': 'Bermuda', 'BN': 'Brunei',
  'BO': 'Bolivia', 'BQ': 'Caribbean Netherlands', 'BR': 'Brazil', 'BS': 'Bahamas', 'BT': 'Bhutan',
  'BV': 'Bouvet Island', 'BW': 'Botswana', 'BY': 'Belarus', 'BZ': 'Belize', 'CA': 'Canada',
  'CC': 'Cocos Islands', 'CD': 'Democratic Republic of the Congo', 'CF': 'Central African Republic',
  'CG': 'Republic of the Congo', 'CH': 'Switzerland', 'CI': 'Ivory Coast', 'CK': 'Cook Islands',
  'CL': 'Chile', 'CM': 'Cameroon', 'CN': 'China', 'CO': 'Colombia', 'CR': 'Costa Rica',
  'CU': 'Cuba', 'CV': 'Cape Verde', 'CW': 'Curaçao', 'CX': 'Christmas Island', 'CY': 'Cyprus',
  'CZ': 'Czech Republic', 'DE': 'Germany', 'DJ': 'Djibouti', 'DK': 'Denmark', 'DM': 'Dominica',
  'DO': 'Dominican Republic', 'DZ': 'Algeria', 'EC': 'Ecuador', 'EE': 'Estonia', 'EG': 'Egypt',
  'EH': 'Western Sahara', 'ER': 'Eritrea', 'ES': 'Spain', 'ET': 'Ethiopia', 'FI': 'Finland',
  'FJ': 'Fiji', 'FK': 'Falkland Islands', 'FM': 'Micronesia', 'FO': 'Faroe Islands', 'FR': 'France',
  'GA': 'Gabon', 'GB': 'United Kingdom', 'GD': 'Grenada', 'GE': 'Georgia', 'GF': 'French Guiana',
  'GG': 'Guernsey', 'GH': 'Ghana', 'GI': 'Gibraltar', 'GL': 'Greenland', 'GM': 'Gambia',
  'GN': 'Guinea', 'GP': 'Guadeloupe', 'GQ': 'Equatorial Guinea', 'GR': 'Greece',
  'GS': 'South Georgia', 'GT': 'Guatemala', 'GU': 'Guam', 'GW': 'Guinea-Bissau', 'GY': 'Guyana',
  'HK': 'Hong Kong', 'HM': 'Heard Island and McDonald Islands', 'HN': 'Honduras', 'HR': 'Croatia',
  'HT': 'Haiti', 'HU': 'Hungary', 'ID': 'Indonesia', 'IE': 'Ireland', 'IL': 'Israel',
  'IM': 'Isle of Man', 'IN': 'India', 'IO': 'British Indian Ocean Territory', 'IQ': 'Iraq',
  'IR': 'Iran', 'IS': 'Iceland', 'IT': 'Italy', 'JE': 'Jersey', 'JM': 'Jamaica', 'JO': 'Jordan',
  'JP': 'Japan', 'KE': 'Kenya', 'KG': 'Kyrgyzstan', 'KH': 'Cambodia', 'KI': 'Kiribati',
  'KM': 'Comoros', 'KN': 'Saint Kitts and Nevis', 'KP': 'North Korea', 'KR': 'South Korea',
  'KW': 'Kuwait', 'KY': 'Cayman Islands', 'KZ': 'Kazakhstan', 'LA': 'Laos', 'LB': 'Lebanon',
  'LC': 'Saint Lucia', 'LI': 'Liechtenstein', 'LK': 'Sri Lanka', 'LR': 'Liberia', 'LS': 'Lesotho',
  'LT': 'Lithuania', 'LU': 'Luxembourg', 'LV': 'Latvia', 'LY': 'Libya', 'MA': 'Morocco',
  'MC': 'Monaco', 'MD': 'Moldova', 'ME': 'Montenegro', 'MF': 'Saint Martin', 'MG': 'Madagascar',
  'MH': 'Marshall Islands', 'MK': 'North Macedonia', 'ML': 'Mali', 'MM': 'Myanmar', 'MN': 'Mongolia',
  'MO': 'Macau', 'MP': 'Northern Mariana Islands', 'MQ': 'Martinique', 'MR': 'Mauritania',
  'MS': 'Montserrat', 'MT': 'Malta', 'MU': 'Mauritius', 'MV': 'Maldives', 'MW': 'Malawi',
  'MX': 'Mexico', 'MY': 'Malaysia', 'MZ': 'Mozambique', 'NA': 'Namibia', 'NC': 'New Caledonia',
  'NE': 'Niger', 'NF': 'Norfolk Island', 'NG': 'Nigeria', 'NI': 'Nicaragua', 'NL': 'Netherlands',
  'NO': 'Norway', 'NP': 'Nepal', 'NR': 'Nauru', 'NU': 'Niue', 'NZ': 'New Zealand', 'OM': 'Oman',
  'PA': 'Panama', 'PE': 'Peru', 'PF': 'French Polynesia', 'PG': 'Papua New Guinea',
  'PH': 'Philippines', 'PK': 'Pakistan', 'PL': 'Poland', 'PM': 'Saint Pierre and Miquelon',
  'PN': 'Pitcairn Islands', 'PR': 'Puerto Rico', 'PS': 'Palestine', 'PT': 'Portugal', 'PW': 'Palau',
  'PY': 'Paraguay', 'QA': 'Qatar', 'RE': 'Réunion', 'RO': 'Romania', 'RS': 'Serbia', 'RU': 'Russia',
  'RW': 'Rwanda', 'SA': 'Saudi Arabia', 'SB': 'Solomon Islands', 'SC': 'Seychelles', 'SD': 'Sudan',
  'SE': 'Sweden', 'SG': 'Singapore', 'SH': 'Saint Helena', 'SI': 'Slovenia', 'SJ': 'Svalbard and Jan Mayen',
  'SK': 'Slovakia', 'SL': 'Sierra Leone', 'SM': 'San Marino', 'SN': 'Senegal', 'SO': 'Somalia',
  'SR': 'Suriname', 'SS': 'South Sudan', 'ST': 'São Tomé and Príncipe', 'SV': 'El Salvador',
  'SX': 'Sint Maarten', 'SY': 'Syria', 'SZ': 'Eswatini', 'TC': 'Turks and Caicos Islands',
  'TD': 'Chad', 'TF': 'French Southern Territories', 'TG': 'Togo', 'TH': 'Thailand', 'TJ': 'Tajikistan',
  'TK': 'Tokelau', 'TL': 'Timor-Leste', 'TM': 'Turkmenistan', 'TN': 'Tunisia', 'TO': 'Tonga',
  'TR': 'Turkey', 'TT': 'Trinidad and Tobago', 'TV': 'Tuvalu', 'TW': 'Taiwan', 'TZ': 'Tanzania',
  'UA': 'Ukraine', 'UG': 'Uganda', 'UM': 'United States Minor Outlying Islands', 'US': 'United States',
  'UY': 'Uruguay', 'UZ': 'Uzbekistan', 'VA': 'Vatican City', 'VC': 'Saint Vincent and the Grenadines',
  'VE': 'Venezuela', 'VG': 'British Virgin Islands', 'VI': 'United States Virgin Islands',
  'VN': 'Vietnam', 'VU': 'Vanuatu', 'WF': 'Wallis and Futuna', 'WS': 'Samoa', 'XK': 'Kosovo',
  'YE': 'Yemen', 'YT': 'Mayotte', 'ZA': 'South Africa', 'ZM': 'Zambia', 'ZW': 'Zimbabwe',
  'INT': 'International'
}

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}

// Fetch data from API
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`))
        }
      })
    }).on('error', reject)
  })
}

// Escape XML special characters
function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Generate XML sitemap with SEO optimizations
function generateSitemap(urls) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
  
  urls.forEach(url => {
    xml += '  <url>\n'
    xml += `    <loc>${escapeXml(url.loc)}</loc>\n`
    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`
    }
    xml += `    <changefreq>${url.changefreq || 'weekly'}</changefreq>\n`
    xml += `    <priority>${url.priority || '0.7'}</priority>\n`
    xml += '  </url>\n'
  })
  
  xml += '</urlset>'
  return xml
}

// Generate sitemap index with lastmod
function generateSitemapIndex(sitemaps) {
  const today = new Date().toISOString().split('T')[0]
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  sitemaps.forEach(sitemap => {
    xml += '  <sitemap>\n'
    xml += `    <loc>${SITE_URL}/${sitemap}</loc>\n`
    xml += `    <lastmod>${today}</lastmod>\n`
    xml += '  </sitemap>\n'
  })
  
  xml += '</sitemapindex>'
  return xml
}

// Generate static pages sitemap
function generatePageSitemap() {
  const today = new Date().toISOString().split('T')[0]
  
  const urls = [
    { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0', lastmod: today },
    { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.8', lastmod: today },
    { loc: `${SITE_URL}/legal`, changefreq: 'monthly', priority: '0.5', lastmod: today },
    { loc: `${SITE_URL}/privacy`, changefreq: 'monthly', priority: '0.5', lastmod: today }
  ]
  
  return generateSitemap(urls)
}

// Generate country sitemap from live data
function generateCountrySitemap(channels) {
  const today = new Date().toISOString().split('T')[0]
  const countries = new Set()
  
  // Extract unique countries from channels
  channels.forEach(channel => {
    if (channel.country) {
      countries.add(channel.country)
    }
  })
  
  // Sort countries by full name and create URLs
  const urls = Array.from(countries)
    .filter(code => COUNTRY_NAMES[code]) // Only include countries we have names for
    .sort((a, b) => COUNTRY_NAMES[a].localeCompare(COUNTRY_NAMES[b]))
    .map(code => ({
      loc: `${SITE_URL}/?country=${code}`,
      changefreq: 'daily',
      priority: '0.9',
      lastmod: today
    }))
  
  return { xml: generateSitemap(urls), count: urls.length }
}

// Generate category sitemap from live data
function generateCategorySitemap(channels) {
  const today = new Date().toISOString().split('T')[0]
  const categories = new Set()
  
  // Extract unique categories from channels
  channels.forEach(channel => {
    if (channel.categories && Array.isArray(channel.categories)) {
      channel.categories.forEach(cat => categories.add(cat))
    }
  })
  
  // Create URLs for each category
  const urls = Array.from(categories)
    .sort()
    .map(category => ({
      loc: `${SITE_URL}/?category=${encodeURIComponent(category)}`,
      changefreq: 'daily',
      priority: '0.9',
      lastmod: today
    }))
  
  return { xml: generateSitemap(urls), count: urls.length }
}

// Generate channel sitemaps (split into multiple files)
function generateChannelSitemaps(channels) {
  const today = new Date().toISOString().split('T')[0]
  const CHANNELS_PER_FILE = 1000
  const sitemapFiles = []
  
  for (let i = 0; i < channels.length; i += CHANNELS_PER_FILE) {
    const chunk = channels.slice(i, i + CHANNELS_PER_FILE)
    const fileNum = Math.floor(i / CHANNELS_PER_FILE) + 1
    
    const urls = chunk.map(channel => ({
      loc: `${SITE_URL}/channel/${channel.id}`,
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: today
    }))
    
    const xml = generateSitemap(urls)
    const filename = `sitemap-channels-${fileNum}.xml`
    
    fs.writeFileSync(path.join(PUBLIC_DIR, filename), xml)
    sitemapFiles.push(filename)
    
    console.log(`✓ Generated ${filename} (${chunk.length} channels)`)
  }
  
  return sitemapFiles
}

// Main function
async function generateSitemaps() {
  console.log('🗺️  Generating sitemaps from live IPTV-org API...\n')
  
  try {
    // Fetch live data from IPTV-org API
    console.log('📡 Fetching live data from IPTV-org API...')
    const [channelsData, streamsData] = await Promise.all([
      fetchJSON(API_CHANNELS),
      fetchJSON(API_STREAMS)
    ])
    console.log(`✓ Fetched ${channelsData.length} channels and ${streamsData.length} streams\n`)

    // Map streams to channels to find which channels have active streams
    const streamsByChannel = new Map()
    streamsData.forEach(stream => {
      if (!streamsByChannel.has(stream.channel)) {
        streamsByChannel.set(stream.channel, [])
      }
      streamsByChannel.get(stream.channel).push(stream)
    })

    // Filter to only include channels with active streams
    const activeChannels = channelsData.filter(channel => 
      streamsByChannel.has(channel.id) && streamsByChannel.get(channel.id).length > 0
    )
    console.log(`✓ Found ${activeChannels.length} active channels with streams\n`)

    // Generate individual sitemaps
    console.log('Generating static pages sitemap...')
    const pageSitemap = generatePageSitemap()
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-page.xml'), pageSitemap)
    console.log('✓ Generated sitemap-page.xml\n')
    
    console.log('Generating country sitemap from live data...')
    const { xml: countrySitemap, count: countryCount } = generateCountrySitemap(activeChannels)
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-country.xml'), countrySitemap)
    console.log(`✓ Generated sitemap-country.xml (${countryCount} countries with full names)\n`)
    
    console.log('Generating category sitemap from live data...')
    const { xml: categorySitemap, count: categoryCount } = generateCategorySitemap(activeChannels)
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-category.xml'), categorySitemap)
    console.log(`✓ Generated sitemap-category.xml (${categoryCount} categories)\n`)
    
    console.log('Generating channel sitemaps from live data...')
    const channelSitemaps = generateChannelSitemaps(activeChannels)
    console.log()
    
    // Generate sitemap index
    console.log('Generating sitemap index...')
    const allSitemaps = [
      'sitemap-page.xml',
      'sitemap-country.xml',
      'sitemap-category.xml',
      ...channelSitemaps
    ]
    
    const sitemapIndex = generateSitemapIndex(allSitemaps)
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndex)
    console.log('✓ Generated sitemap.xml (index)\n')
    
    console.log(`✅ Successfully generated ${allSitemaps.length + 1} sitemap files from live API data!`)
    console.log(`📊 Total sitemaps: ${allSitemaps.length}`)
    console.log(`📡 Active channels: ${activeChannels.length}`)
    console.log(`🌍 Countries: ${countryCount} (with full names)`)
    console.log(`📂 Categories: ${categoryCount}`)
    console.log(`📍 Main sitemap: ${SITE_URL}/sitemap.xml`)
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error)
    process.exit(1)
  }
}

// Run the generator
generateSitemaps()
