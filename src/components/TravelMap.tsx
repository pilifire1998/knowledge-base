import { useEffect, useState, useRef } from 'react';

type Location = {
  id: string;
  name: string;
  nameJp: string;
  lat: number;
  lng: number;
  day: number;
  type: string;
  desc: string;
};

// 景点数据
const locations = {
  osaka: [
    { id: 'kix', name: '关西机场', nameJp: '関西国際空港', lat: 34.4347, lng: 135.2441, day: 1, type: 'transport', desc: '抵达/离开机场' },
    { id: 'namba', name: '难波站', nameJp: 'なんば駅', lat: 34.6658, lng: 135.5010, day: 1, type: 'transport', desc: '南海电铁终点站' },
    { id: 'kuromon', name: '黑门市场', nameJp: 'くろもんいちば', lat: 34.6662, lng: 135.5065, day: 1, type: 'food', desc: '大阪厨房，美食天堂' },
    { id: 'shinsaibashi', name: '心斋桥', nameJp: 'しんさいばし', lat: 34.6718, lng: 135.5027, day: 1, type: 'shopping', desc: '购物天堂' },
    { id: 'dotonbori', name: '道顿堀', nameJp: 'どうとんぼり', lat: 34.6686, lng: 135.5010, day: 1, type: 'food', desc: '格力高跑男打卡地' },
    { id: 'osaka-castle', name: '大阪城', nameJp: 'おおさかじょう', lat: 34.6873, lng: 135.5262, day: 2, type: 'temple', desc: '日本三大名城之一' },
    { id: 'umeda', name: '梅田蓝天大厦', nameJp: 'うめだスカイビル', lat: 34.7054, lng: 135.4903, day: 2, type: 'view', desc: '360度城市全景' },
    { id: 'tsutenkaku', name: '通天阁', nameJp: 'つうてんかく', lat: 34.6523, lng: 135.5072, day: 2, type: 'view', desc: '新世界昭和风情' },
    { id: 'usj', name: 'USJ环球影城', nameJp: 'ユニバーサル・スタジオ', lat: 34.6654, lng: 135.4323, day: 3, type: 'attraction', desc: '任天堂世界必玩！' }
  ],
  kyoto: [
    { id: 'fushimi', name: '伏见稻荷大社', nameJp: 'ふしみいなりたいしゃ', lat: 34.9671, lng: 135.7727, day: 4, type: 'temple', desc: '千本鸟居震撼' },
    { id: 'kiyomizu', name: '清水寺', nameJp: 'きよみずでら', lat: 35.0039, lng: 135.7683, day: 4, type: 'temple', desc: '清水舞台必打卡' },
    { id: 'ninenzaka', name: '二年坂三年坂', nameJp: 'にねんざか・さんねんざか', lat: 34.9985, lng: 135.7675, day: 4, type: 'street', desc: '传统古街，和服拍照' },
    { id: 'gion', name: '祇园', nameJp: 'ぎおん', lat: 35.0036, lng: 135.7781, day: 4, type: 'street', desc: '花见小路，舞伎偶遇' },
    { id: 'arashiyama', name: '岚山竹林', nameJp: 'ちくりんのこみち', lat: 35.0168, lng: 135.6714, day: 5, type: 'nature', desc: '世界最美森林之一' },
    { id: 'tenryuji', name: '天龙寺', nameJp: 'てんりゅうじ', lat: 35.0156, lng: 135.6726, day: 5, type: 'temple', desc: '世界文化遗产' },
    { id: 'togetsukyo', name: '渡月桥', nameJp: 'とげつきょう', lat: 35.0094, lng: 135.6707, day: 5, type: 'view', desc: '岚山地标' },
    { id: 'kinkakuji', name: '金阁寺', nameJp: 'きんかくじ', lat: 35.0394, lng: 135.7292, day: 6, type: 'temple', desc: '金光闪闪必打卡' },
    { id: 'nishiki', name: '锦市场', nameJp: 'にしきいちば', lat: 35.0051, lng: 135.7662, day: 6, type: 'food', desc: '京都厨房' }
  ],
  nara: [
    { id: 'nara-park', name: '奈良公园', nameJp: 'ならこうえん', lat: 34.6851, lng: 135.8430, day: 7, type: 'nature', desc: '喂小鹿互动 🦌' },
    { id: 'todaiji', name: '东大寺', nameJp: 'とうだいじ', lat: 34.6890, lng: 135.8398, day: 7, type: 'temple', desc: '世界最大木建筑' },
    { id: 'kasuga', name: '春日大社', nameJp: 'かすがたいしゃ', lat: 34.6812, lng: 135.8483, day: 7, type: 'temple', desc: '3000座石灯笼' },
    { id: 'naramachi', name: '奈良町', nameJp: 'ならまち', lat: 34.6778, lng: 135.8319, day: 7, type: 'street', desc: '传统街道，麻薯必吃' }
  ],
  kobe: [
    { id: 'kitano', name: '北野异人馆', nameJp: 'きたのいじんかん', lat: 34.6936, lng: 135.1888, day: 8, type: 'street', desc: '西洋建筑群' },
    { id: 'kobe-port', name: '神户港', nameJp: 'こうべこう', lat: 34.6823, lng: 135.1950, day: 8, type: 'view', desc: '港口塔夜景' },
    { id: 'nankinmachi', name: '南京町', nameJp: 'なんきんまち', lat: 34.6885, lng: 135.1873, day: 8, type: 'food', desc: '中华街小吃' }
  ]
};

// 类型配置
const typeConfig: Record<string, { color: string; emoji: string; label: string }> = {
  temple: { color: '#e74c3c', emoji: '⛩️', label: '寺庙神社' },
  food: { color: '#e67e22', emoji: '🍜', label: '美食' },
  shopping: { color: '#3498db', emoji: '🛍️', label: '购物' },
  view: { color: '#2ecc71', emoji: '🗼', label: '观景' },
  nature: { color: '#1abc9c', emoji: '🌲', label: '自然' },
  attraction: { color: '#9b59b6', emoji: '🎢', label: '景点' },
  street: { color: '#f39c12', emoji: '🏠', label: '街道' },
  transport: { color: '#95a5a6', emoji: '🚃', label: '交通' }
};

// 日期颜色
const dayColors: Record<number, string> = {
  1: '#e74c3c', 2: '#e67e22', 3: '#9b59b6', 4: '#3498db',
  5: '#1abc9c', 6: '#2ecc71', 7: '#f39c12', 8: '#e91e63'
};

export default function TravelMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);

  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const allLocations: Location[] = [
    ...locations.osaka, ...locations.kyoto, ...locations.nara, ...locations.kobe
  ];

  const filteredLocations = allLocations.filter(loc => {
    if (selectedDay !== 'all' && loc.day !== selectedDay) return false;
    if (selectedCity !== 'all') {
      const cityLocations = locations[selectedCity as keyof typeof locations];
      if (!cityLocations?.find(l => l.id === loc.id)) return false;
    }
    return true;
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 动态加载 Leaflet
  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      // 修复默认图标
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [34.8, 135.5],
        zoom: 9,
        scrollWheelZoom: true,
        zoomControl: false,
      });

      // 添加缩放控件到右下角
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // 使用 Esri World Street Map 真彩色地图瓦片
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; Esri',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      leafletRef.current = L;
      setMapReady(true);
    });
  }, [isClient]);

  // 更新标记
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !leafletRef.current) return;

    const map = mapInstanceRef.current;
    const L = leafletRef.current;

    // 清除现有
    markersRef.current.forEach(m => m.remove());
    polylinesRef.current.forEach(p => p.remove());
    markersRef.current = [];
    polylinesRef.current = [];

    // 创建 SVG 标记图标
    const createMarkerIcon = (color: string, day: number) => {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
            </filter>
          </defs>
          <path d="M18 0C8.06 0 0 8.06 0 18c0 12 18 26 18 26s18-14 18-26C36 8.06 27.94 0 18 0z"
                fill="${color}"/>
          <circle cx="18" cy="16" r="10" fill="white"/>
          <text x="18" y="20" text-anchor="middle" font-size="10" font-weight="bold"
                fill="${color}" font-family="system-ui,sans-serif">D${day}</text>
        </svg>`;
      return L.divIcon({
        html: svg,
        className: 'travel-marker',
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -44],
      });
    };

    // 路线
    const days = selectedDay === 'all' ? [1,2,3,4,5,6,7,8] : [selectedDay];
    days.forEach(day => {
      const dayLocs = allLocations.filter(l => l.day === day);
      if (dayLocs.length > 1) {
        const line = L.polyline(dayLocs.map(l => [l.lat, l.lng]), {
          color: dayColors[day], weight: 3, opacity: 0.85, dashArray: '6, 4'
        }).addTo(map);
        polylinesRef.current.push(line);
      }
    });

    // 标记
    filteredLocations.forEach(loc => {
      const config = typeConfig[loc.type] || typeConfig.temple;
      const icon = createMarkerIcon(config.color, loc.day);
      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 180px; font-family: system-ui, sans-serif;">
            <div style="font-size: 13px; font-weight: bold; color: ${dayColors[loc.day]}; margin-bottom: 4px;">
              Day ${loc.day} · ${config.emoji}
            </div>
            <div style="font-size: 15px; font-weight: bold; color: #1a1a1a;">${loc.name}</div>
            <div style="font-size: 12px; color: #666;">${loc.nameJp}</div>
            <div style="font-size: 13px; color: #444; margin-top: 4px;">${loc.desc}</div>
            <a href="https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}"
               target="_blank" style="display: inline-block; margin-top: 8px; font-size: 12px; color: #3498db; text-decoration: none;">
              📍 Google Maps →
            </a>
          </div>
        `, { minWidth: 200 });
      markersRef.current.push(marker);
    });
  }, [mapReady, selectedDay, selectedCity, filteredLocations]);

  const flyToCity = (city: string) => {
    const centers: Record<string, { center: [number, number]; zoom: number }> = {
      all: { center: [34.8, 135.5], zoom: 9 },
      osaka: { center: [34.67, 135.50], zoom: 12 },
      kyoto: { center: [35.00, 135.76], zoom: 12 },
      nara: { center: [34.68, 135.84], zoom: 14 },
      kobe: { center: [34.69, 135.19], zoom: 13 }
    };
    const target = centers[city] || centers.all;
    mapInstanceRef.current?.flyTo(target.center, target.zoom, { duration: 0.5 });
    setSelectedCity(city);
  };

  const flyToLocation = (loc: Location) => {
    mapInstanceRef.current?.flyTo([loc.lat, loc.lng], 15, { duration: 0.5 });
    setSelectedLocation(loc);
  };

  if (!isClient) {
    return (
      <div style={{
        height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#f0f0f0', borderRadius: '8px', color: '#666',
        fontSize: '14px', flexDirection: 'column', gap: '8px', border: '1px solid var(--color-border)'
      }}>
        <span style={{ fontSize: '32px' }}>🗺️</span>
        <span>地图加载中...</span>
      </div>
    );
  }

  return (
    <div className="travel-map-container">
      {/* 控制面板 */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px',
        padding: '10px 12px', backgroundColor: 'var(--color-surface)', borderRadius: '10px',
        border: '1px solid var(--color-border)', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>📍</span>
          {['all', 'osaka', 'kyoto', 'nara', 'kobe'].map(city => (
            <button key={city} onClick={() => flyToCity(city)} style={{
              padding: '4px 10px', borderRadius: '12px', minHeight: '32px',
              border: selectedCity === city ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: selectedCity === city ? 'var(--color-primary)' : 'transparent',
              color: selectedCity === city ? 'var(--color-bg)' : 'var(--color-secondary)', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s'
            }}>
              {city === 'all' ? '全部' : city === 'osaka' ? '大阪' : city === 'kyoto' ? '京都' : city === 'nara' ? '奈良' : '神户'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>📅</span>
          <button onClick={() => setSelectedDay('all')} style={{
            padding: '4px 10px', borderRadius: '12px', minHeight: '32px',
            border: selectedDay === 'all' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
            backgroundColor: selectedDay === 'all' ? 'var(--color-primary)' : 'transparent',
            color: selectedDay === 'all' ? 'var(--color-bg)' : 'var(--color-secondary)', cursor: 'pointer', fontSize: '12px'
          }}>全部</button>
          {[1,2,3,4,5,6,7,8].map(day => (
            <button key={day} onClick={() => setSelectedDay(day)} style={{
              padding: '4px 8px', borderRadius: '10px', minHeight: '32px',
              border: selectedDay === day ? 'none' : '1px solid var(--color-border)',
              backgroundColor: selectedDay === day ? dayColors[day] : 'transparent',
              color: selectedDay === day ? 'white' : 'var(--color-secondary)', cursor: 'pointer', fontSize: '12px',
              fontWeight: selectedDay === day ? 'bold' : 'normal', transition: 'all 0.2s'
            }}>D{day}</button>
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px',
        padding: '8px 12px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', fontSize: '12px', color: 'var(--color-secondary)'
      }}>
        {Object.entries(typeConfig).map(([type, config]) => (
          <span key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{config.emoji}</span><span>{config.label}</span>
          </span>
        ))}
      </div>

      {/* 地图 */}
      <div ref={mapRef} style={{ height: '400px', borderRadius: '10px', border: '1px solid var(--color-border)', overflow: 'hidden' }} />

      {/* 景点列表 */}
      <div style={{ marginTop: '12px' }}>
        <h4 style={{ marginBottom: '10px', fontSize: '14px', color: 'var(--color-secondary)' }}>
          📍 景点列表 ({filteredLocations.length} 个)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '6px' }}>
          {filteredLocations.map(loc => {
            const config = typeConfig[loc.type] || typeConfig.temple;
            return (
              <div key={loc.id} onClick={() => flyToLocation(loc)} style={{
                padding: '8px 10px', cursor: 'pointer', fontSize: '12px',
                backgroundColor: selectedLocation?.id === loc.id ? 'var(--color-bg)' : 'var(--color-surface)',
                border: `1px solid ${selectedLocation?.id === loc.id ? dayColors[loc.day] : 'var(--color-border)'}`,
                borderRadius: '6px', transition: 'all 0.15s', minHeight: '40px', display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ color: dayColors[loc.day], fontWeight: 'bold', marginRight: '4px', flexShrink: 0 }}>D{loc.day}</span>
                <span style={{ marginRight: '4px', flexShrink: 0 }}>{config.emoji}</span>
                <span style={{ color: 'var(--color-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .travel-marker {
          background: none !important;
          border: none !important;
        }
        .travel-marker svg {
          display: block;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 10px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        }
        .leaflet-popup-content {
          margin: 12px 14px !important;
        }
        .leaflet-container {
          font-family: system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
}
