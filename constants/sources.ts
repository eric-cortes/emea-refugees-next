export interface Source {
  title: string
  url: string
}

export const SOURCE_GROUPS: { key: 'data' | 'reports' | 'reporting'; items: Source[] }[] = [
  {
    key: 'data',
    items: [
      { title: 'IOM – Missing Migrants Project, all data 2014–2026', url: 'https://missingmigrants.iom.int/downloads' },
      { title: 'UNHCR – Global Trends 2025', url: 'https://www.unhcr.org/sites/default/files/2026-06/global-trends-report-2025.pdf' },
      { title: 'UNHCR – Global Report 2025: Syria', url: 'https://www.unhcr.org/sites/default/files/2026-06/global-report-2025-situation-overview-syria.pdf' },
      { title: 'UNHCR – Italy sea arrivals, December 2016', url: 'https://data.unhcr.org/en/documents/download/53099' },
      { title: 'Eurostat – Temporary protection for persons fleeing Ukraine', url: 'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250910-1' },
      { title: 'EUAA – Asylum Report 2026', url: 'https://www.euaa.europa.eu/asylum-report-2026/box-4-temporary-protection-displaced-persons-ukraine' },
      { title: 'Open-Meteo – Historical Weather API (ERA5 reanalysis), daily mean temperature 1991–2020', url: 'https://open-meteo.com/en/docs/historical-weather-api' },
      { title: 'bpb – Asylanträge in Deutschland', url: 'https://www.bpb.de/gesellschaft/migration/flucht/265708/asylantraege-und-asylsuchende' },
    ],
  },
  {
    key: 'reports',
    items: [
      { title: 'Border Violence Monitoring Network – Introduction to Context', url: 'https://borderviolence.eu/introduction-to-context' },
      { title: 'Mixed Migration Centre – “I wouldn’t wish this journey on my worst enemy”, April 2026', url: 'https://mixedmigration.org/resources/western-balkans-refugees-migrants-bosnia-and-herzegovina-2025/' },
      { title: 'ICMPD – 2015 in review: chronology of events and policy responses', url: 'https://www.icmpd.org/file/download/59411/file/2015%2520in%2520review_Chronology%2520of%2520events%2520and%2520policy%2520responses.pdf' },
      { title: 'European Court of Auditors – Migration management in Greece and Italy, November 2019', url: 'https://www.eca.europa.eu/lists/ecadocuments/insr19_24/insr_migration_management_en.pdf' },
    ],
  },
  {
    key: 'reporting',
    items: [
      { title: 'Alexandra Stanic, VICE – So verloren sind Geflüchtete auf dem Balkan, 16 March 2020', url: 'https://www.vice.com/de/article/gefluchtete-balkan-bosnien-herzegowina-balkanroute/' },
      { title: 'NBC News – October arrivals nearly equal 2014 total, 2015', url: 'https://www.nbcnews.com/storyline/europes-border-crisis/migrant-crisis-october-arrivals-nearly-equal-2014-total-unhcr-says-n455601' },
      { title: 'UNHCR – Turmoil and tragedy in Lesvos, 2015', url: 'https://data.unhcr.org/en/news/12822' },
      { title: 'vienna.at – The A4 refugee tragedy, 10 years later', url: 'https://www.vienna.at/refugee-drama-on-the-a4-still-shakes-10-years-later/9591164' },
      { title: 'Salzburg24 – Flüchtlingsdrama auf der A4', url: 'https://www.salzburg24.at/news/welt/fluechtlingsdrama-auf-a4-drei-schockierende-erkenntnisse-art-97783' },
      { title: 'Quartz – Berlin’s refugee services, 2016', url: 'https://qz.com/578018/berlins-refugee-services-are-becoming-a-bureaucratic-nightmare' },
      { title: 'The Local – Berlin refugee boss leaves, December 2015', url: 'https://www.thelocal.de/20151210/berlin-refugee-boss-leaves-in-disgrace' },
      { title: 'Heinrich-Böll-Stiftung – Nachts vor dem Lageso, December 2015', url: 'https://www.boell.de/de/2015/12/12/nachts-vor-dem-lageso' },
      { title: 'To Vima – Nearly 10,000 refugees gather at Idomeni, 2 March 2016', url: 'https://www.tovima.gr/2016/03/02/international/pressure-mounts-as-nearly-10-000-refugees-gather-at-idomeni/' },
      { title: 'The Jakarta Post (AP) – Refugees face closed border, 9 March 2016', url: 'https://www.thejakartapost.com/news/2016/03/09/despair-confusion-greece-refugees-face-closed-border' },
      { title: 'Euronews – Fire at Lipa camp, 23 December 2020', url: 'https://www.euronews.com/my-europe/2020/12/23/huge-fire-breaks-out-at-lipa-migrant-camp-near-bosnia-s-border-with-croatia' },
      { title: 'N1 – IOM on the Lipa camp fire', url: 'https://n1info.ba/english/news/a497755-IOM-Head-in-BiH-A-group-of-migrants-set-fire-to-the-Lipa-migrant-camp' },
      { title: 'Statewatch – Lampedusa anniversary, 2017', url: 'https://www.statewatch.org/news/2017/october/mediterranean-italy-marks-anniversary-of-lampedusa-tragedy-following-weekend-rescues-of-over-1000-people' },
      { title: 'The New Arab – 1.3 million Syrian refugees returned in 2025', url: 'https://www.newarab.com/news/around-13-million-syrian-refugees-returned-2025-unhcr?amp=1' },
      { title: 'N1 – Landmine blast near Saborsko, March 2021', url: 'https://n1info.hr/english/news/one-migrant-killed-more-injured-in-landmine-blast-near-croatia-bosnia-border' },
      { title: 'European Press Prize – Mines, memory, and migration on Bosnia’s perilous border, 2026', url: 'https://www.europeanpressprize.com/?p=29553' },
      { title: 'ICRC – Tragedy at Evros: a perilous river crossing to Greece, 2017', url: 'https://www.icrc.org/en/document/tragedy-evros-perilous-river-crossing-greece' },
      { title: 'The Peninsula (AP) – Croatia police save 15 migrants from snow and cold, January 2019', url: 'https://thepeninsulaqatar.com/article/16/01/2019/Croatia-police-save-15-migrants-from-snow-and-cold' },
      { title: 'N1 – Boat capsizes on the Drina river, 22 August 2024', url: 'https://n1info.ba/english/news/migrant-boat-capsizes-on-drina-river-serbian-and-bosnian-police-launch-search-operation' },
      { title: 'Al Jazeera – Thousands of refugees homeless after fire destroys Moria camp, September 2020', url: 'https://www.aljazeera.com/news/2020/9/9/thousands-of-refugees-homeless-after-fire-destroys-moria-camp' },
      { title: 'Global Voices – The refugees stopping at Vienna’s Train Station of Hope, November 2015', url: 'https://globalvoices.org/2015/11/16/train-of-hope-refugees/' },
      { title: 'vienna.at – Syrians have filed over 125,000 asylum applications in Austria since 2015', url: 'https://www.vienna.at/syrians-have-filed-over-125000-asylum-applications-in-austria-since-2015/9580601' },
      { title: 'Der Standard – 90.000 Asylanträge im Jahr 2015', url: 'https://www.derstandard.at/story/2000028877483/90-000-asylantraege-im-jahr-2015' },
      { title: 'The Local – Tempelhof as Germany’s biggest refugee home, January 2016', url: 'https://www.thelocal.de/20160122/berlin-mulls-plans-to-turn-historic-airport-into-germanys-biggest-refugee-home' },
      { title: 'The Peninsula (AFP) – Greece starts evacuating Idomeni camp, 24 May 2016', url: 'https://thepeninsulaqatar.com/article/24/05/2016/Greece-starts-evacuating-squalid-Idomeni-migrant-camp' },
      { title: 'To Vima – Idomeni evacuation continues, 26 May 2016', url: 'https://www.tovima.gr/2016/05/26/international/idomeni-refugee-camp-evacuation-operation-continues/' },
    ],
  },
]
