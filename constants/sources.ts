export interface Source {
  id: string
  title: string
  url: string
}

export const SOURCE_GROUPS: { key: 'data' | 'reports' | 'reporting'; items: Source[] }[] = [
  {
    key: 'data',
    items: [
      { id: 'iom-mmp-data', title: 'IOM – Missing Migrants Project, all data 2014–2026', url: 'https://missingmigrants.iom.int/downloads' },
      { id: 'unhcr-global-trends-2025', title: 'UNHCR – Global Trends 2025', url: 'https://www.unhcr.org/sites/default/files/2026-06/global-trends-report-2025.pdf' },
      { id: 'unhcr-global-report-syria-2025', title: 'UNHCR – Global Report 2025: Syria', url: 'https://www.unhcr.org/sites/default/files/2026-06/global-report-2025-situation-overview-syria.pdf' },
      { id: 'unhcr-italy-sea-arrivals-2016', title: 'UNHCR – Italy sea arrivals, December 2016', url: 'https://data.unhcr.org/en/documents/download/53099' },
      { id: 'eurostat-ukraine-temporary-protection', title: 'Eurostat – Temporary protection for persons fleeing Ukraine', url: 'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250910-1' },
      { id: 'euaa-asylum-report-2026', title: 'EUAA – Asylum Report 2026', url: 'https://www.euaa.europa.eu/asylum-report-2026/box-4-temporary-protection-displaced-persons-ukraine' },
      { id: 'open-meteo-era5', title: 'Open-Meteo – Historical Weather API (ERA5 reanalysis), daily mean temperature 1991–2020', url: 'https://open-meteo.com/en/docs/historical-weather-api' },
      { id: 'bpb-asylantraege', title: 'bpb – Asylanträge in Deutschland', url: 'https://www.bpb.de/gesellschaft/migration/flucht/265708/asylantraege-und-asylsuchende' },
      { id: 'bamf-migrationsbericht-2015', title: 'BAMF – Migrationsbericht 2015', url: 'https://www.bamf.de/SharedDocs/Anlagen/DE/Forschung/Migrationsberichte/migrationsbericht-2015.pdf' },
    ],
  },
  {
    key: 'reports',
    items: [
      { id: 'bvmn-context', title: 'Border Violence Monitoring Network – Introduction to Context', url: 'https://borderviolence.eu/introduction-to-context' },
      { id: 'mmc-bosnia-2026', title: 'Mixed Migration Centre – “I wouldn’t wish this journey on my worst enemy”, April 2026', url: 'https://mixedmigration.org/resources/western-balkans-refugees-migrants-bosnia-and-herzegovina-2025/' },
      { id: 'icmpd-2015-review', title: 'ICMPD – 2015 in review: chronology of events and policy responses', url: 'https://www.icmpd.org/file/download/59411/file/2015%2520in%2520review_Chronology%2520of%2520events%2520and%2520policy%2520responses.pdf' },
      { id: 'eca-greece-italy-2019', title: 'European Court of Auditors – Migration management in Greece and Italy, November 2019', url: 'https://www.eca.europa.eu/lists/ecadocuments/insr19_24/insr_migration_management_en.pdf' },
      { id: 'unicef-fyrom-serbia-2015', title: 'UNICEF – Rising numbers of women and children pass through the former Yugoslav Republic of Macedonia and Serbia, September 2015', url: 'https://unicefusa.org/press/rising-numbers-women-and-children-pass-through-former-yugoslav-republic-macedonia-and-serbia' },
      { id: 'ecre-western-balkans-2015', title: 'ECRE – Solidarity initiatives in Western Balkans, 4 September 2015', url: 'https://ecre.org/solidarity-initiatives-in-western-balkans-but-lack-of-a-sustainable-response-ecre-brief' },
      { id: 'osw-balkan-route-2015', title: 'OSW – The Balkan migration route following the closure of the Hungarian-Croatian border, 21 October 2015', url: 'https://www.osw.waw.pl/en/publikacje/analyses/2015-10-21/balkan-migration-route-following-closure-hungarian-croatian-border' },
      { id: 'mirovni-sentilj-2015', title: 'Mirovni inštitut – Second report from Šentilj, November 2015', url: 'https://www.mirovni-institut.si/en/second-report-from-sentilj/' },
      { id: 'european-council-eu-turkey', title: 'European Council – EU–Turkey statement, 18 March 2016', url: 'https://www.consilium.europa.eu/en/press/press-releases/2016/03/18/eu-turkey-statement/' },
      { id: 'amnesty-traiskirchen-2015', title: 'Amnesty International Austria – Findings of the research mission in Traiskirchen, August 2015', url: 'https://www.amnesty.at/media/1929/endergebnisse-der-amnesty-international-research-mission-in-traiskirchen.pdf' },
    ],
  },
  {
    key: 'reporting',
    items: [
      { id: 'vice-stanic-2020', title: 'Alexandra Stanic, VICE – So verloren sind Geflüchtete auf dem Balkan, 16 March 2020', url: 'https://www.vice.com/de/article/gefluchtete-balkan-bosnien-herzegowina-balkanroute/' },
      { id: 'nbc-october-arrivals', title: 'NBC News – October arrivals nearly equal 2014 total, 2015', url: 'https://www.nbcnews.com/storyline/europes-border-crisis/migrant-crisis-october-arrivals-nearly-equal-2014-total-unhcr-says-n455601' },
      { id: 'unhcr-lesvos-2015', title: 'UNHCR – Turmoil and tragedy in Lesvos, 2015', url: 'https://data.unhcr.org/en/news/12822' },
      { id: 'viennaat-a4-tragedy', title: 'vienna.at – The A4 refugee tragedy, 10 years later', url: 'https://www.vienna.at/refugee-drama-on-the-a4-still-shakes-10-years-later/9591164' },
      { id: 'salzburg24-a4', title: 'Salzburg24 – Flüchtlingsdrama auf der A4', url: 'https://www.salzburg24.at/news/welt/fluechtlingsdrama-auf-a4-drei-schockierende-erkenntnisse-art-97783' },
      { id: 'quartz-berlin-2016', title: 'Quartz – Berlin’s refugee services, 2016', url: 'https://qz.com/578018/berlins-refugee-services-are-becoming-a-bureaucratic-nightmare' },
      { id: 'thelocal-lageso-boss', title: 'The Local – Berlin refugee boss leaves, December 2015', url: 'https://www.thelocal.de/20151210/berlin-refugee-boss-leaves-in-disgrace' },
      { id: 'boell-lageso', title: 'Heinrich-Böll-Stiftung – Nachts vor dem Lageso, December 2015', url: 'https://www.boell.de/de/2015/12/12/nachts-vor-dem-lageso' },
      { id: 'tovima-idomeni-10000', title: 'To Vima – Nearly 10,000 refugees gather at Idomeni, 2 March 2016', url: 'https://www.tovima.gr/2016/03/02/international/pressure-mounts-as-nearly-10-000-refugees-gather-at-idomeni/' },
      { id: 'jakarta-post-closed-border', title: 'The Jakarta Post (AP) – Refugees face closed border, 9 March 2016', url: 'https://www.thejakartapost.com/news/2016/03/09/despair-confusion-greece-refugees-face-closed-border' },
      { id: 'euronews-lipa-fire', title: 'Euronews – Fire at Lipa camp, 23 December 2020', url: 'https://www.euronews.com/my-europe/2020/12/23/huge-fire-breaks-out-at-lipa-migrant-camp-near-bosnia-s-border-with-croatia' },
      { id: 'n1-iom-lipa', title: 'N1 – IOM on the Lipa camp fire', url: 'https://n1info.ba/english/news/a497755-IOM-Head-in-BiH-A-group-of-migrants-set-fire-to-the-Lipa-migrant-camp' },
      { id: 'statewatch-lampedusa', title: 'Statewatch – Lampedusa anniversary, 2017', url: 'https://www.statewatch.org/news/2017/october/mediterranean-italy-marks-anniversary-of-lampedusa-tragedy-following-weekend-rescues-of-over-1000-people' },
      { id: 'newarab-syria-returns', title: 'The New Arab – 1.3 million Syrian refugees returned in 2025', url: 'https://www.newarab.com/news/around-13-million-syrian-refugees-returned-2025-unhcr?amp=1' },
      { id: 'n1-saborsko-mine', title: 'N1 – Landmine blast near Saborsko, March 2021', url: 'https://n1info.hr/english/news/one-migrant-killed-more-injured-in-landmine-blast-near-croatia-bosnia-border' },
      { id: 'epp-bosnia-mines', title: 'European Press Prize – Mines, memory, and migration on Bosnia’s perilous border, 2026', url: 'https://www.europeanpressprize.com/?p=29553' },
      { id: 'icrc-evros', title: 'ICRC – Tragedy at Evros: a perilous river crossing to Greece, 2017', url: 'https://www.icrc.org/en/document/tragedy-evros-perilous-river-crossing-greece' },
      { id: 'peninsula-croatia-snow', title: 'The Peninsula (AP) – Croatia police save 15 migrants from snow and cold, January 2019', url: 'https://thepeninsulaqatar.com/article/16/01/2019/Croatia-police-save-15-migrants-from-snow-and-cold' },
      { id: 'n1-drina-boat', title: 'N1 – Boat capsizes on the Drina river, 22 August 2024', url: 'https://n1info.ba/english/news/migrant-boat-capsizes-on-drina-river-serbian-and-bosnian-police-launch-search-operation' },
      { id: 'aljazeera-moria-fire', title: 'Al Jazeera – Thousands of refugees homeless after fire destroys Moria camp, September 2020', url: 'https://www.aljazeera.com/news/2020/9/9/thousands-of-refugees-homeless-after-fire-destroys-moria-camp' },
      { id: 'globalvoices-train-of-hope', title: 'Global Voices – The refugees stopping at Vienna’s Train Station of Hope, November 2015', url: 'https://globalvoices.org/2015/11/16/train-of-hope-refugees/' },
      { id: 'viennaat-syrian-asylum', title: 'vienna.at – Syrians have filed over 125,000 asylum applications in Austria since 2015', url: 'https://www.vienna.at/syrians-have-filed-over-125000-asylum-applications-in-austria-since-2015/9580601' },
      { id: 'derstandard-asyl-2015', title: 'Der Standard – 90.000 Asylanträge im Jahr 2015', url: 'https://www.derstandard.at/story/2000028877483/90-000-asylantraege-im-jahr-2015' },
      { id: 'thelocal-tempelhof', title: 'The Local – Tempelhof as Germany’s biggest refugee home, January 2016', url: 'https://www.thelocal.de/20160122/berlin-mulls-plans-to-turn-historic-airport-into-germanys-biggest-refugee-home' },
      { id: 'peninsula-idomeni-evacuation', title: 'The Peninsula (AFP) – Greece starts evacuating Idomeni camp, 24 May 2016', url: 'https://thepeninsulaqatar.com/article/24/05/2016/Greece-starts-evacuating-squalid-Idomeni-migrant-camp' },
      { id: 'tovima-idomeni-evacuation', title: 'To Vima – Idomeni evacuation continues, 26 May 2016', url: 'https://www.tovima.gr/2016/05/26/international/idomeni-refugee-camp-evacuation-operation-continues/' },
      { id: 'rferl-hungary-croatia', title: 'RFE/RL – Hungary closed border with Croatia at midnight, October 2015', url: 'https://www.rferl.org/a/hungary-close-border-croatia-migrants-eu/27310195.html' },
      { id: 'euobserver-croatia-buses', title: 'euobserver – Croatia puts migrants on buses to Hungary, September 2015', url: 'https://euobserver.com/11404/croatia-puts-migrants-on-buses-to-hungary/' },
      { id: 'tcn-slavonski-brod', title: 'Total Croatia News – Transit centre in Slavonski Brod ready for first refugees, November 2015', url: 'https://total-croatia-news.com/news/transit-centre-in-slavonski-brod-ready-for-first-refugees/' },
      { id: 'intellinews-western-balkans-2018', title: 'IntelliNews – Migrant flow to Western Balkans intensifies in 2018', url: 'https://www.intellinews.com/migrant-flow-to-western-balkans-intensifies-in-2018-143131/' },
      { id: 'n1-bosnia-croatia-border-2018', title: 'N1 – Some 4,000 migrants near Bosnia–Croatia border, 2018', url: 'https://n1info.hr/english/news/a329866-EC-estimate-Some-4000-migrants-near-Bosnia-Croatia-border/' },
      { id: 'tovima-54341-greece', title: 'To Vima – Latest estimate indicates 54,341 refugees currently in Greece, 9 May 2016', url: 'https://www.tovima.gr/2016/05/09/international/latest-estimate-indicates-54-341-refugees-currently-in-greece/' },
      { id: 'greekreporter-un-greece-entry', title: 'Greek Reporter – UN report: Greece is main entry country for refugees and migrants travelling to Europe, 2 July 2015', url: 'https://greekreporter.com/2015/07/02/un-report-greece-is-main-entry-county-for-refugees-and-migrants-travelling-to-europe/' },
      { id: 'un-news-million-2015', title: 'UN News – Refugees and migrants braving seas to flee to Europe in 2015 top one million, December 2015', url: 'https://news.un.org/en/node/519142' },
      { id: 'business-standard-million', title: 'Business Standard (PTI) – Over 1 million arrivals in Europe by sea: UNHCR, 30 December 2015', url: 'https://www.business-standard.com/article/pti-stories/over-1-million-arrivals-in-europe-by-sea-unhcr-115123000668_1.html' },
      { id: 'euronews-traiskirchen', title: 'Euronews – Austria: overwhelmed refugee centre closes to new arrivals, 4 August 2015', url: 'https://www.euronews.com/2015/08/04/austria-overwhelmed-refugee-centre-closes-to-new-arrivals' },
      { id: 'voa-croatia-denies-2018', title: 'VOA – Croatia denies abusing migrants at Bosnian border, December 2018', url: 'https://voanews.com/a/croatia-denies-abusing-migrants-at-bosnian-border-/4702933.html' },
      { id: 'n1-minister-denies-2019', title: 'N1 – Minister denies allegations of sending migrants illegally back to Bosnia, 2019', url: 'https://n1info.hr/english/news/a372255-Minister-denies-allegations-of-sending-migrants-illegally-back-to-Bosnia' },
      { id: 'n1-officers-suspended-2021', title: 'N1 – Three Croatian riot officers suspended over violent push-backs, October 2021', url: 'https://n1info.ba/english/news/three-croatian-riot-officers-suspended-over-violent-push-backs-of-migrants' },
      { id: 'thenational-croatia-admits-2021', title: 'The National – Croatia admits for first time the violent pushback of migrants, 8 October 2021', url: 'https://thenationalnews.com/world/uk-news/2021/10/08/croatia-admits-for-first-time-the-violent-pushback-of-migrants' },
    ],
  },
]

const SOURCES_BY_ID = new Map(SOURCE_GROUPS.flatMap(group => group.items).map(item => [item.id, item]))

export function getSource(id: string): Source | undefined {
  return SOURCES_BY_ID.get(id)
}
