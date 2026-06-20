import { Clock, Repeat, DollarSign, Navigation, Ticket, AlertCircle, ChevronRight, Train, Leaf, Bike, TrendingDown, Sprout } from 'lucide-react';
import { useMetroStore } from '@/store/metroStore';
import { getStationById, getLineById, fareConfig, lowCarbonConfig, getBikeParkingById } from '@/data/metroNetwork';
import type { RouteResult, RouteStrategy, BikeFeederSegment } from '@/types/metro';
import { cn } from '@/lib/utils';

const strategyLabels: Record<RouteStrategy, string> = {
  'shortest-time': '最短时间',
  'min-transfers': '最少换乘',
  'lowest-fare': '最低票价',
  'low-carbon': '低碳出行',
};

const strategyBadgeColors: Record<RouteStrategy, string> = {
  'shortest-time': 'bg-blue-500 text-white',
  'min-transfers': 'bg-amber-500 text-white',
  'lowest-fare': 'bg-green-500 text-white',
  'low-carbon': 'bg-emerald-600 text-white',
};

function FareBreakdown({ route }: { route: RouteResult }) {
  const stationFare = route.segments.reduce((sum, s) => sum + s.fare, 0);
  const transferFare = route.transfers.reduce((sum, t) => sum + t.penalty, 0);
  const bikeCost = route.bikeFeeder?.totalBikeCost ?? 0;

  return (
    <div className="mt-3 pt-3 border-t border-dashed border-slate-200 space-y-1.5">
      <div className="flex justify-between text-xs text-slate-500">
        <span>基础票价</span>
        <span>¥{fareConfig.baseFare.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>里程费（{route.stationCount}站）</span>
        <span>¥{(stationFare).toFixed(2)}</span>
      </div>
      {route.transfers.length > 0 && (
        <div className="flex justify-between text-xs text-slate-500">
          <span>换乘附加费（{route.transfers.length}次）</span>
          <span>¥{transferFare.toFixed(2)}</span>
        </div>
      )}
      {bikeCost > 0 && (
        <div className="flex justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1"><Bike size={10} className="text-teal-500" />骑行接驳费</span>
          <span>¥{bikeCost.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between text-sm font-bold text-slate-800 pt-1">
        <span>总计</span>
        <span>¥{route.totalFare.toFixed(2)}</span>
      </div>
    </div>
  );
}

function LowCarbonComparison({ route }: { route: RouteResult }) {
  const carbonSavedKg = (route.carbonSavedGrams / 1000).toFixed(2);
  const treesEquivalent = (route.carbonSavedGrams / 1800).toFixed(2);

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
          <Leaf size={16} className="text-white" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-800">低碳出行对比</h4>
          <p className="text-[11px] text-emerald-600">相较于自驾出行</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
          <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-medium mb-1">
            <TrendingDown size={12} /> 节省费用
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-700">¥{route.moneySaved.toFixed(2)}</span>
          </div>
          <div className="text-[10px] text-emerald-500 mt-0.5">
            驾车预估 ¥{route.baselineFare.toFixed(2)}
          </div>
        </div>
        <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
          <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-medium mb-1">
            <Sprout size={12} /> 减少碳排放
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-700">{carbonSavedKg}</span>
            <span className="text-xs font-normal text-emerald-600">kg</span>
          </div>
          <div className="text-[10px] text-emerald-500 mt-0.5">
            ≈ 种植 {treesEquivalent} 棵树年吸碳量
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600">
            <div className="w-3 h-3 rounded bg-slate-400" />
            驾车排放 {(route.baselineCarbonGrams / 1000).toFixed(2)} kg
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            当前方案 {(route.carbonEmissionGrams / 1000).toFixed(2)} kg
          </div>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all"
            style={{ width: `${route.baselineCarbonGrams > 0 ? Math.max(5, (route.carbonEmissionGrams / route.baselineCarbonGrams) * 100) : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function BikeFeederInfo({ segment }: { segment: BikeFeederSegment }) {
  const bikeParking = getBikeParkingById(segment.bikeParkingId);
  const isToStation = segment.type === 'bike-to-station';

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow flex items-center justify-center">
          <Bike size={8} className="text-white" />
        </div>
        <div className="w-0.5 flex-1 my-1 bg-teal-300" style={{ minHeight: 40 }} />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Bike size={14} className="text-teal-500" />
          <span className="text-xs font-bold px-2 py-0.5 rounded-md text-white bg-teal-500">
            {isToStation ? '骑行至地铁站' : '骑行至目的地'}
          </span>
          <span className="text-xs text-slate-400">
            {segment.bikeTimeMinutes}分钟 · ¥{segment.bikeCost.toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-slate-700 font-medium">
          {segment.bikeParkingName}
        </div>
        <div className="text-xs text-slate-400 mt-0.5 space-y-0.5">
          <div>骑行距离 {segment.distanceKm} 公里</div>
          {bikeParking && (
            <div className="flex items-center gap-2">
              <span>车位 {bikeParking.availableSpots}/{bikeParking.totalSpots}</span>
              <span>·</span>
              <span>¥{bikeParking.unitPricePerHour}/小时</span>
              <span>·</span>
              <span>开锁费 ¥{bikeParking.unlockFee.toFixed(2)}</span>
            </div>
          )}
          <div className="text-emerald-600 flex items-center gap-1">
            <Leaf size={10} />
            减碳 {(segment.carbonSavedGrams / 1000).toFixed(3)} kg
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteCard({
  route,
  isActive,
  onClick,
}: {
  route: RouteResult;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl border p-4 transition-all',
        isActive
          ? 'border-indigo-400 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300',
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            'px-2 py-0.5 rounded-md text-xs font-bold',
            isActive ? strategyBadgeColors[route.strategy] : 'bg-slate-100 text-slate-700',
          )}
        >
          {strategyLabels[route.strategy]}
        </span>
        <div className="flex items-center gap-2">
          {route.travelMode === 'bike-feeder' && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-700 flex items-center gap-0.5">
              <Bike size={9} />骑行接驳
            </span>
          )}
          {route.carbonSavedGrams > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-0.5">
              <Leaf size={9} />-{(route.carbonSavedGrams / 1000).toFixed(1)}kg
            </span>
          )}
          {isActive && <ChevronRight size={16} className="text-indigo-500" />}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-1">
        <div className="flex items-center gap-1 text-sm">
          <Clock size={14} className="text-blue-500" />
          <span className="font-bold text-slate-800">{route.totalTime}</span>
          <span className="text-xs text-slate-500">分钟</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Repeat size={14} className="text-amber-500" />
          <span className="font-bold text-slate-800">{route.transferCount}</span>
          <span className="text-xs text-slate-500">次换乘</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <DollarSign size={14} className="text-green-500" />
          <span className="font-bold text-slate-800">¥{route.totalFare.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>途经 {route.stationCount} 站</span>
        {route.moneySaved > 0 && (
          <span className="text-emerald-600 flex items-center gap-0.5">
            <TrendingDown size={10} />省 ¥{route.moneySaved.toFixed(2)}
          </span>
        )}
      </div>
    </button>
  );
}

function RouteTimeline({ route }: { route: RouteResult }) {
  const elements: JSX.Element[] = [];

  if (route.bikeFeeder?.toStation) {
    elements.push(
      <div key="bike-to" className="animate-in fade-in slide-in-from-top-2">
        <BikeFeederInfo segment={route.bikeFeeder.toStation} />
      </div>,
    );
  }

  let segmentIndex = 0;
  let transferIndex = 0;

  const totalSteps = route.segments.length + route.transfers.length;

  for (let i = 0; i < totalSteps; i++) {
    if (i % 2 === 0) {
      const segment = route.segments[segmentIndex];
      const line = getLineById(segment.line);
      const fromStation = getStationById(segment.fromStation);
      const toStation = getStationById(segment.toStation);

      elements.push(
        <div key={`seg-${i}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: line?.color ?? '#888' }}
            />
            <div
              className="w-0.5 flex-1 my-1"
              style={{ backgroundColor: line?.color ?? '#888', minHeight: 40 }}
            />
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Train size={14} style={{ color: line?.color }} />
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-md text-white"
                style={{ backgroundColor: line?.color }}
              >
                {line?.name.split('（')[0]}
              </span>
              <span className="text-xs text-slate-400">
                {segment.travelTime}分钟 · ¥{segment.fare.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-slate-700 font-medium">
              {fromStation?.name} → {toStation?.name}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              共 {segment.stationCount} 站
            </div>
          </div>
        </div>,
      );
      segmentIndex++;
    } else {
      const transfer = route.transfers[transferIndex];
      const station = getStationById(transfer.station);
      const fromLine = getLineById(transfer.fromLine);
      const toLine = getLineById(transfer.toLine);

      elements.push(
        <div key={`tr-${i}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div className="w-0.5 flex-1 my-1 bg-amber-300" style={{ minHeight: 40 }} />
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Repeat size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                换乘
              </span>
              <span className="text-xs text-slate-400">
                {transfer.walkTime}分钟步行 · ¥{transfer.penalty.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-slate-700 font-medium">
              {station?.name}
              {station?.isHub && <span className="ml-1 text-amber-500">★枢纽</span>}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <span
                className="inline-block w-3 h-1.5 rounded-full"
                style={{ backgroundColor: fromLine?.color }}
              />
              <ChevronRight size={10} />
              <span
                className="inline-block w-3 h-1.5 rounded-full"
                style={{ backgroundColor: toLine?.color }}
              />
            </div>
          </div>
        </div>,
      );
      transferIndex++;
    }
  }

  if (route.bikeFeeder?.fromStation) {
    elements.push(
      <div key="bike-from" className="animate-in fade-in slide-in-from-top-2">
        <BikeFeederInfo segment={route.bikeFeeder.fromStation} />
      </div>,
    );
  }

  if (elements.length > 0) {
    const last = route.segments[route.segments.length - 1];
    const lastStation = getStationById(last.toStation);
    elements.push(
      <div key="end" className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-rose-600">
            {route.bikeFeeder?.fromStation ? '骑行完成，到达目的地' : `到达 ${lastStation?.name}`}
          </div>
        </div>
      </div>,
    );
  }

  return <div className="mt-2">{elements}</div>;
}

export default function RouteResults() {
  const { routeResults, highlightedRoute, selectedStrategy, setSelectedStrategy, setHighlightedRoute, travelMode } =
    useMetroStore();

  const allRoutes = Array.from(routeResults.entries())
    .filter(([, r]) => r !== null)
    .map(([strategy, route]) => ({ strategy, route: route! }));

  if (allRoutes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <Navigation size={28} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-1">等待查询</h3>
        <p className="text-sm text-slate-500">选择起终点和策略后点击"查询路线"</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Ticket size={18} className="text-indigo-500" />
            路线方案
          </h3>
          <span className={cn(
            'px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1',
            travelMode === 'bike-feeder'
              ? 'bg-teal-100 text-teal-700'
              : 'bg-indigo-100 text-indigo-700',
          )}>
            {travelMode === 'bike-feeder' ? <><Bike size={11} />骑行接驳模式</> : <><Train size={11} />纯地铁模式</>}
          </span>
        </div>
        <div className="space-y-2">
          {allRoutes.map(({ strategy, route }) => (
            <RouteCard
              key={strategy}
              route={route}
              isActive={selectedStrategy === strategy && highlightedRoute?.strategy === strategy}
              onClick={() => {
                setSelectedStrategy(strategy);
                setHighlightedRoute(route);
              }}
            />
          ))}
        </div>
      </div>

      {highlightedRoute && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Navigation size={18} className="text-indigo-500" />
              路线详情
            </h3>
            <div className="flex items-center gap-2">
              {highlightedRoute.travelMode === 'bike-feeder' && (
                <span className="px-2 py-1 bg-teal-500 text-white text-xs font-bold rounded-md flex items-center gap-1">
                  <Bike size={11} />骑行接驳
                </span>
              )}
              <span className={cn(
                'px-2.5 py-1 text-white text-xs font-bold rounded-md',
                strategyBadgeColors[highlightedRoute.strategy],
              )}>
                {strategyLabels[highlightedRoute.strategy]}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-blue-600 text-xs font-medium mb-0.5">
                <Clock size={13} /> 预计耗时
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {highlightedRoute.totalTime}
                <span className="text-sm font-normal ml-1">分钟</span>
              </div>
              {highlightedRoute.bikeFeeder && highlightedRoute.bikeFeeder.totalBikeTime > 0 && (
                <div className="text-[11px] text-blue-500 mt-0.5">
                  含骑行 {highlightedRoute.bikeFeeder.totalBikeTime} 分钟
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-green-600 text-xs font-medium mb-0.5">
                <DollarSign size={13} /> 总费用
              </div>
              <div className="text-2xl font-bold text-green-700">
                ¥{highlightedRoute.totalFare.toFixed(2)}
              </div>
              {highlightedRoute.moneySaved > 0 && (
                <div className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1">
                  <TrendingDown size={10} />较驾车省 ¥{highlightedRoute.moneySaved.toFixed(2)}
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-amber-600 text-xs font-medium mb-0.5">
                <Repeat size={13} /> 换乘次数
              </div>
              <div className="text-2xl font-bold text-amber-700">
                {highlightedRoute.transferCount}
                <span className="text-sm font-normal ml-1">次</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-purple-600 text-xs font-medium mb-0.5">
                <Train size={13} /> 途经站点
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {highlightedRoute.stationCount}
                <span className="text-sm font-normal ml-1">站</span>
              </div>
            </div>
          </div>

          <LowCarbonComparison route={highlightedRoute} />

          <RouteTimeline route={highlightedRoute} />
          <FareBreakdown route={highlightedRoute} />

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700 leading-relaxed">
              <p className="font-semibold mb-0.5">计费规则说明</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>基础票价 ¥{fareConfig.baseFare.toFixed(2)}，每站 ¥{fareConfig.perStationRate.toFixed(2)}</li>
                <li>枢纽换乘附加费 ¥{fareConfig.hubTransferSurcharge.toFixed(2)}，普通换乘 ¥0.50</li>
                <li>高峰时段（早晚高峰）票价上浮 {Math.round(fareConfig.peakSurcharge * 100)}%</li>
                <li>最低 ¥{fareConfig.minFare.toFixed(2)}，最高 ¥{fareConfig.maxFare.toFixed(2)}</li>
                {highlightedRoute.travelMode === 'bike-feeder' && (
                  <li>骑行开锁费 ¥{lowCarbonConfig.bikeUnlockFee.toFixed(2)}，每公里 ¥{lowCarbonConfig.bikeRatePerKm.toFixed(2)}，单次最高 ¥{lowCarbonConfig.bikeMaxCostPerTrip.toFixed(2)}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
