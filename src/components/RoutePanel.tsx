import { MapPin, Clock, Repeat, DollarSign, Lock, RotateCcw, Search, Sun, Sunset, Moon, X, Bike, Train, Leaf } from 'lucide-react';
import { stations, getStationById, getBikeParkingByStationId } from '@/data/metroNetwork';
import { useMetroStore } from '@/store/metroStore';
import type { RouteStrategy, TimePeriod, TravelMode } from '@/types/metro';
import { cn } from '@/lib/utils';

const strategies: { value: RouteStrategy; label: string; icon: typeof Clock; desc: string; color: string }[] = [
  { value: 'shortest-time', label: '最短时间', icon: Clock, desc: '优先总耗时最少', color: 'text-blue-500' },
  { value: 'min-transfers', label: '最少换乘', icon: Repeat, desc: '尽量减少换乘次数', color: 'text-amber-500' },
  { value: 'lowest-fare', label: '最低票价', icon: DollarSign, desc: '优先费用最低', color: 'text-green-500' },
  { value: 'low-carbon', label: '低碳出行', icon: Leaf, desc: '优先碳排放最少', color: 'text-emerald-600' },
];

const timePeriods: { value: TimePeriod; label: string; icon: typeof Sun; color: string }[] = [
  { value: 'morning-peak', label: '早高峰', icon: Sun, color: 'text-orange-500' },
  { value: 'off-peak', label: '平峰', icon: Moon, color: 'text-blue-400' },
  { value: 'evening-peak', label: '晚高峰', icon: Sunset, color: 'text-rose-500' },
];

const travelModes: { value: TravelMode; label: string; icon: typeof Train; desc: string; color: string }[] = [
  { value: 'metro-only', label: '纯地铁', icon: Train, desc: '仅乘坐地铁出行', color: 'text-indigo-500' },
  { value: 'bike-feeder', label: '骑行接驳', icon: Bike, desc: '骑行+地铁组合出行', color: 'text-teal-500' },
];

export default function RoutePanel() {
  const {
    startStationId,
    endStationId,
    selectedStrategy,
    timePeriod,
    travelMode,
    userOrigin,
    userDestination,
    blockedStations,
    isCalculating,
    error,
    setStartStation,
    setEndStation,
    setSelectedStrategy,
    setTimePeriod,
    setTravelMode,
    setUserOrigin,
    setUserDestination,
    toggleBlockedStation,
    clearBlockedStations,
    calculateRoutes,
    resetAll,
  } = useMetroStore();

  const startStation = startStationId ? getStationById(startStationId) : null;
  const endStation = endStationId ? getStationById(endStationId) : null;
  const startBikeParking = startStationId ? getBikeParkingByStationId(startStationId) : null;
  const endBikeParking = endStationId ? getBikeParkingByStationId(endStationId) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-indigo-500" />
          行程设置
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">起点</label>
            <select
              value={startStationId ?? ''}
              onChange={(e) => setStartStation(e.target.value || null)}
              className="w-full px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value="">-- 选择起点站 --</option>
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.isHub && '★'}{s.bikeParking && ' 🚲'}
                </option>
              ))}
            </select>
            {startStation && startBikeParking && (
              <div className="mt-1.5 text-[11px] text-teal-600 flex items-center gap-1">
                <Bike size={10} />
                {startBikeParking.name} · 可用车位 {startBikeParking.availableSpots}/{startBikeParking.totalSpots} · ¥{startBikeParking.unitPricePerHour}/小时
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">终点</label>
            <select
              value={endStationId ?? ''}
              onChange={(e) => setEndStation(e.target.value || null)}
              className="w-full px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            >
              <option value="">-- 选择终点站 --</option>
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.isHub && '★'}{s.bikeParking && ' 🚲'}
                </option>
              ))}
            </select>
            {endStation && endBikeParking && (
              <div className="mt-1.5 text-[11px] text-teal-600 flex items-center gap-1">
                <Bike size={10} />
                {endBikeParking.name} · 可用车位 {endBikeParking.availableSpots}/{endBikeParking.totalSpots} · ¥{endBikeParking.unitPricePerHour}/小时
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">出行方式</label>
            <div className="grid grid-cols-2 gap-2">
              {travelModes.map((tm) => {
                const Icon = tm.icon;
                const active = travelMode === tm.value;
                return (
                  <button
                    key={tm.value}
                    onClick={() => setTravelMode(tm.value)}
                    className={cn(
                      'flex flex-col items-start gap-1 px-3 py-2.5 rounded-lg border text-left transition-all',
                      active
                        ? 'border-teal-400 bg-teal-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50',
                    )}
                  >
                    <div className={cn('flex items-center gap-1.5', active ? tm.color : 'text-slate-600')}>
                      <Icon size={14} />
                      <span className="text-sm font-semibold">{tm.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{tm.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {travelMode === 'bike-feeder' && (
            <div className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-teal-800 flex items-center gap-1.5">
                  <Bike size={14} />
                  骑行接驳位置
                </h4>
                <span className="text-[10px] text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                  未设置时使用默认位置
                </span>
              </div>

              <div>
                <label className="text-[11px] font-medium text-teal-700 mb-1 block">
                  用户出发位置 (X, Y)  ←→  起点站骑行接驳
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-1 bg-white border border-teal-200 rounded-md px-2 py-1">
                      <span className="text-[10px] text-teal-500">X</span>
                      <input
                        type="number"
                        value={userOrigin?.x ?? ''}
                        placeholder={startStation ? String(startStation.x + 75) : '475'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            if (!userOrigin?.y) setUserOrigin(null);
                            else setUserOrigin({ x: 0, y: userOrigin.y });
                          } else {
                            const num = Number(val);
                            const defaultY = startStation ? startStation.y - 75 : 225;
                            setUserOrigin({ x: num, y: userOrigin?.y || defaultY });
                          }
                        }}
                        className="w-full bg-transparent text-xs text-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-teal-200 rounded-md px-2 py-1">
                      <span className="text-[10px] text-teal-500">Y</span>
                      <input
                        type="number"
                        value={userOrigin?.y ?? ''}
                        placeholder={startStation ? String(startStation.y - 75) : '225'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            if (!userOrigin?.x) setUserOrigin(null);
                            else setUserOrigin({ x: userOrigin.x, y: 0 });
                          } else {
                            const num = Number(val);
                            const defaultX = startStation ? startStation.x + 75 : 475;
                            setUserOrigin({ x: userOrigin?.x || defaultX, y: num });
                          }
                        }}
                        className="w-full bg-transparent text-xs text-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setUserOrigin(null)}
                    className="px-2 py-1 bg-white border border-teal-200 rounded-md text-[10px] text-teal-600 hover:bg-teal-50"
                    title="恢复默认"
                  >
                    默认
                  </button>
                </div>
                {startStation && (
                  <p className="text-[10px] text-teal-600 mt-1">
                    默认距起点站约 2.1km · 骑行需约 {Math.round(2.1 / 15 * 60)} 分钟
                  </p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-medium text-teal-700 mb-1 block">
                  终点站骑行接驳  ←→  用户目的位置 (X, Y)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-1 bg-white border border-teal-200 rounded-md px-2 py-1">
                      <span className="text-[10px] text-teal-500">X</span>
                      <input
                        type="number"
                        value={userDestination?.x ?? ''}
                        placeholder={endStation ? String(endStation.x - 75) : '325'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            if (!userDestination?.y) setUserDestination(null);
                            else setUserDestination({ x: 0, y: userDestination.y });
                          } else {
                            const num = Number(val);
                            const defaultY = endStation ? endStation.y + 75 : 375;
                            setUserDestination({ x: num, y: userDestination?.y || defaultY });
                          }
                        }}
                        className="w-full bg-transparent text-xs text-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-teal-200 rounded-md px-2 py-1">
                      <span className="text-[10px] text-teal-500">Y</span>
                      <input
                        type="number"
                        value={userDestination?.y ?? ''}
                        placeholder={endStation ? String(endStation.y + 75) : '375'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            if (!userDestination?.x) setUserDestination(null);
                            else setUserDestination({ x: userDestination.x, y: 0 });
                          } else {
                            const num = Number(val);
                            const defaultX = endStation ? endStation.x - 75 : 325;
                            setUserDestination({ x: userDestination?.x || defaultX, y: num });
                          }
                        }}
                        className="w-full bg-transparent text-xs text-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setUserDestination(null)}
                    className="px-2 py-1 bg-white border border-teal-200 rounded-md text-[10px] text-teal-600 hover:bg-teal-50"
                    title="恢复默认"
                  >
                    默认
                  </button>
                </div>
                {endStation && (
                  <p className="text-[10px] text-teal-600 mt-1">
                    默认距终点站约 2.1km · 骑行需约 {Math.round(2.1 / 15 * 60)} 分钟
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-teal-200/60">
                <p className="text-[10px] text-teal-700 leading-tight">
                  💡 按各停车场 <b>开锁费+时长单价</b> 计费
                </p>
                <p className="text-[10px] text-teal-700 leading-tight">
                  单次封顶 ¥6
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">时间段</label>
            <div className="grid grid-cols-3 gap-2">
              {timePeriods.map((tp) => (
                <button
                  key={tp.value}
                  onClick={() => setTimePeriod(tp.value)}
                  className={cn(
                    'flex flex-col items-center gap-1 px-2 py-2 rounded-lg border text-xs font-medium transition-all',
                    timePeriod === tp.value
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                  )}
                >
                  <tp.icon size={16} className={tp.color} />
                  {tp.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              高峰时段票价上浮30%，行程及换乘时间延长
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Search size={18} className="text-indigo-500" />
          策略选择
        </h3>
        <div className="space-y-2">
          {strategies.map((st) => {
            const Icon = st.icon;
            const active = selectedStrategy === st.value;
            return (
              <button
                key={st.value}
                onClick={() => setSelectedStrategy(st.value)}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                  active
                    ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    active ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500',
                  )}
                >
                  <Icon size={16} className={active ? '' : st.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      'text-sm font-semibold',
                      active ? 'text-indigo-700' : 'text-slate-700',
                    )}
                  >
                    {st.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{st.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Lock size={18} className="text-slate-500" />
            站点封锁
          </h3>
          {blockedStations.length > 0 && (
            <button
              onClick={clearBlockedStations}
              className="text-xs text-slate-500 hover:text-rose-500 flex items-center gap-1"
            >
              <X size={12} />
              全部清除
            </button>
          )}
        </div>
        {blockedStations.length === 0 ? (
          <p className="text-xs text-slate-400">暂无封锁站点，点击地图"封锁站点"按钮或下方站点进行封锁</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-2">
            {blockedStations.map((sid) => {
              const s = getStationById(sid);
              return (
                <button
                  key={sid}
                  onClick={() => toggleBlockedStation(sid)}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 text-white text-xs rounded-md hover:bg-rose-600 transition-colors"
                >
                  <Lock size={10} />
                  {s?.name}
                  <X size={10} />
                </button>
              );
            })}
          </div>
        )}
        <div className="mt-2 max-h-32 overflow-y-auto">
          <div className="grid grid-cols-2 gap-1">
            {stations.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleBlockedStation(s.id)}
                className={cn(
                  'text-left px-2 py-1.5 text-xs rounded-md transition-colors',
                  blockedStations.includes(s.id)
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100',
                )}
              >
                {s.name} {s.isHub && '★'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={calculateRoutes}
          disabled={isCalculating || !startStation || !endStation}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Search size={18} />
          {isCalculating ? '计算中...' : '查询路线'}
        </button>
        <button
          onClick={resetAll}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
        >
          <RotateCcw size={18} />
          重置
        </button>
      </div>
    </div>
  );
}
