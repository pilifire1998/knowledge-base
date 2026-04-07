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
  temple: { color: 'red', emoji: '⛩️', label: '寺庙神社' },
  food: { color: 'orange', emoji: '🍜', label: '美食' },
  shopping: { color: 'blue', emoji: '🛍️', label: '购物' },
  view: { color: 'green', emoji: '🗼', label: '观景' },
  nature: { color: 'green', emoji: '🌲', label: '自然' },
  attraction: { color: 'purple', emoji: '🎢', label: '景点' },
  street: { color: 'yellow', emoji: '🏠', label: '街道' },
  transport: { color: 'grey', emoji: '🚃', label: '交通' }
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

  // 客户端检查
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 动态加载 Leaflet
  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    // 动态导入 Leaflet
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      // 修复图标
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [34.8, 135.5],
        zoom: 9,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
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

    // 自定义图标
    const createIcon = (color: string) => new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });

    // 路线
    const days = selectedDay === 'all' ? [1,2,3,4,5,6,7,8] : [selectedDay];
    days.forEach(day => {
      const dayLocs = allLocations.filter(l => l.day === day);
      if (dayLocs.length > 1) {
        const line = L.polyline(dayLocs.map(l => [l.lat, l.lng]), {
          color: dayColors[day], weight: 3, opacity: 0.7
        }).addTo(map);
        polylinesRef.current.push(line);
      }
    });

    // 标记
    filteredLocations.forEach(loc => {
      const config = typeConfig[loc.type] || typeConfig.temple;
      const marker = L.marker([loc.lat, loc.lng], { icon: createIcon(config.color) })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 180px;">
            <div style="font-size: 14px; font-weight: bold; color: ${dayColors[loc.day]};">
              Day ${loc.day} · ${config.emoji}
            </div>
            <div style="font-size: 15px; font-weight: bold;">${loc.name}</div>
            <div style="font-size: 12px; color: #666;">${loc.nameJp}</div>
            <div style="font-size: 13px; margin-top: 4px;">${loc.desc}</div>
            <a href="https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}"
               target="_blank" style="font-size: 12px; color: #3498db;">
              📍 Google Maps
            </a>
          </div>
        `);
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
    return <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface)', borderRadius: '8px' }}>🗺️ 地图加载中...</div>;
  }

  return (
    <div className="travel-map-container">
      {/* 控制面板 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', padding: '12px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '14px' }}>📍 城市：</span>
          {['all', 'osaka', 'kyoto', 'nara', 'kobe'].map(city => (
            <button key={city} onClick={() => flyToCity(city)} style={{
              padding: '4px 12px', borderRadius: '16px',
              border: selectedCity === city ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: selectedCity === city ? 'var(--color-primary)' : 'transparent',
              color: selectedCity === city ? 'white' : 'var(--color-text)', cursor: 'pointer', fontSize: '13px'
            }}>
              {city === 'all' ? '全部' : city === 'osaka' ? '大阪' : city === 'kyoto' ? '京都' : city === 'nara' ? '奈良' : '神户'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '14px' }}>📅 日期：</span>
          <button onClick={() => setSelectedDay('all')} style={{
            padding: '4px 12px', borderRadius: '16px',
            border: selectedDay === 'all' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
            backgroundColor: selectedDay === 'all' ? 'var(--color-primary)' : 'transparent',
            color: selectedDay === 'all' ? 'white' : 'var(--color-text)', cursor: 'pointer', fontSize: '13px'
          }}>全部</button>
          {[1,2,3,4,5,6,7,8].map(day => (
            <button key={day} onClick={() => setSelectedDay(day)} style={{
              padding: '4px 10px', borderRadius: '16px',
              border: selectedDay === day ? 'none' : '1px solid var(--color-border)',
              backgroundColor: selectedDay === day ? dayColors[day] : 'transparent',
              color: selectedDay === day ? 'white' : 'var(--color-text)', cursor: 'pointer', fontSize: '13px', fontWeight: selectedDay === day ? 'bold' : 'normal'
            }}>D{day}</button>
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px', padding: '8px 12px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', fontSize: '13px' }}>
        {Object.entries(typeConfig).map(([type, config]) => (
          <span key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{config.emoji}</span><span>{config.label}</span>
          </span>
        ))}
      </div>

      {/* 地图 */}
      <div ref={mapRef} style={{ height: '500px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />

      {/* 景点列表 */}
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ marginBottom: '12px' }}>📍 景点列表 ({filteredLocations.length} 个)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '8px' }}>
          {filteredLocations.map(loc => {
            const config = typeConfig[loc.type] || typeConfig.temple;
            return (
              <div key={loc.id} onClick={() => flyToLocation(loc)} style={{
                padding: '8px 12px', cursor: 'pointer', fontSize: '13px',
                backgroundColor: selectedLocation?.id === loc.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
                border: `1px solid ${selectedLocation?.id === loc.id ? dayColors[loc.day] : 'var(--color-border)'}`,
                borderRadius: '6px'
              }}>
                <span style={{ color: dayColors[loc.day], fontWeight: 'bold', marginRight: '6px' }}>D{loc.day}</span>
                <span>{config.emoji}</span>
                <span style={{ marginLeft: '4px' }}>{loc.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
