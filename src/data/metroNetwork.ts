import type { Station, MetroLine, TransferChannel, FareConfig, BikeParkingStation, LowCarbonConfig } from '@/types/metro';

export const lowCarbonConfig: LowCarbonConfig = {
  carEmissionPerKm: 180,
  busEmissionPerKm: 80,
  metroEmissionPerKm: 35,
  bikeEmissionPerKm: 0,
  avgCarSpeedKmh: 35,
  avgBikeSpeedKmh: 15,
  avgBusSpeedKmh: 25,
  stationDistanceKm: 1.2,
  bikeUnlockFee: 1.5,
  bikeRatePerKm: 0.5,
  bikeMaxCostPerTrip: 6,
};

export const bikeParkingStations: BikeParkingStation[] = [
  { id: 'BP001', name: '中央公园北P+R', stationId: 'S001', totalSpots: 200, availableSpots: 145, unitPricePerHour: 2, unlockFee: 1.5, x: 380, y: 275 },
  { id: 'BP002', name: '科技园西门', stationId: 'S002', totalSpots: 120, availableSpots: 78, unitPricePerHour: 1.5, unlockFee: 1.5, x: 230, y: 180 },
  { id: 'BP003', name: '金融中心A座', stationId: 'S003', totalSpots: 180, availableSpots: 92, unitPricePerHour: 2.5, unlockFee: 1.5, x: 575, y: 180 },
  { id: 'BP004', name: '大学城东门', stationId: 'S004', totalSpots: 300, availableSpots: 210, unitPricePerHour: 1, unlockFee: 1, x: 175, y: 275 },
  { id: 'BP005', name: '人民广场南', stationId: 'S005', totalSpots: 150, availableSpots: 45, unitPricePerHour: 2, unlockFee: 1.5, x: 675, y: 275 },
  { id: 'BP006', name: '海滨浴场站', stationId: 'S006', totalSpots: 80, availableSpots: 60, unitPricePerHour: 1, unlockFee: 1, x: 125, y: 425 },
  { id: 'BP007', name: '会展中心P1', stationId: 'S007', totalSpots: 250, availableSpots: 180, unitPricePerHour: 2, unlockFee: 1.5, x: 725, y: 425 },
  { id: 'BP008', name: '北苑枢纽', stationId: 'S009', totalSpots: 160, availableSpots: 100, unitPricePerHour: 1.5, unlockFee: 1.5, x: 525, y: 80 },
  { id: 'BP009', name: '商贸区市场', stationId: 'S016', totalSpots: 140, availableSpots: 85, unitPricePerHour: 1.5, unlockFee: 1, x: 325, y: 375 },
  { id: 'BP010', name: '高铁站北广场', stationId: 'S017', totalSpots: 400, availableSpots: 256, unitPricePerHour: 3, unlockFee: 2, x: 525, y: 375 },
  { id: 'BP011', name: '机场T2接驳', stationId: 'S018', totalSpots: 500, availableSpots: 320, unitPricePerHour: 2, unlockFee: 2, x: 125, y: 575 },
  { id: 'BP012', name: '文化中心西', stationId: 'S019', totalSpots: 100, availableSpots: 68, unitPricePerHour: 1.5, unlockFee: 1.5, x: 375, y: 525 },
];

export const stations: Station[] = [
  { id: 'S001', name: '中央公园', x: 400, y: 300, lines: ['L1', 'L2', 'L4'], isHub: true, bikeParking: bikeParkingStations[0] },
  { id: 'S002', name: '科技园区', x: 250, y: 200, lines: ['L1'], isHub: false, bikeParking: bikeParkingStations[1] },
  { id: 'S003', name: '金融中心', x: 550, y: 200, lines: ['L1', 'L3'], isHub: true, bikeParking: bikeParkingStations[2] },
  { id: 'S004', name: '大学城', x: 150, y: 300, lines: ['L1', 'L5'], isHub: true, bikeParking: bikeParkingStations[3] },
  { id: 'S005', name: '人民广场', x: 650, y: 300, lines: ['L1', 'L2'], isHub: true, bikeParking: bikeParkingStations[4] },
  { id: 'S006', name: '海滨浴场', x: 100, y: 450, lines: ['L1'], isHub: false, bikeParking: bikeParkingStations[5] },
  { id: 'S007', name: '会展中心', x: 700, y: 450, lines: ['L1', 'L6'], isHub: true, bikeParking: bikeParkingStations[6] },
  { id: 'S008', name: '南山', x: 300, y: 100, lines: ['L2'], isHub: false },
  { id: 'S009', name: '北苑', x: 500, y: 100, lines: ['L2', 'L3'], isHub: true, bikeParking: bikeParkingStations[7] },
  { id: 'S010', name: '东湖', x: 200, y: 500, lines: ['L2'], isHub: false },
  { id: 'S011', name: '西郊', x: 600, y: 500, lines: ['L2'], isHub: false },
  { id: 'S012', name: '博物馆', x: 700, y: 100, lines: ['L3'], isHub: false },
  { id: 'S013', name: '体育馆', x: 800, y: 200, lines: ['L3'], isHub: false },
  { id: 'S014', name: '动物园', x: 750, y: 350, lines: ['L3', 'L6'], isHub: true },
  { id: 'S015', name: '工业园', x: 100, y: 150, lines: ['L4'], isHub: false },
  { id: 'S016', name: '商贸区', x: 300, y: 400, lines: ['L4', 'L5'], isHub: true, bikeParking: bikeParkingStations[8] },
  { id: 'S017', name: '高铁站', x: 500, y: 400, lines: ['L4', 'L6'], isHub: true, bikeParking: bikeParkingStations[9] },
  { id: 'S018', name: '机场', x: 100, y: 600, lines: ['L5'], isHub: false, bikeParking: bikeParkingStations[10] },
  { id: 'S019', name: '文化中心', x: 400, y: 550, lines: ['L5', 'L6'], isHub: true, bikeParking: bikeParkingStations[11] },
  { id: 'S020', name: '世纪大道', x: 600, y: 600, lines: ['L6'], isHub: false },
];

export const metroLines: MetroLine[] = [
  {
    id: 'L1',
    name: '1号线（东西干线）',
    color: '#e53935',
    stations: ['S006', 'S004', 'S002', 'S001', 'S003', 'S005', 'S007'],
    baseFarePerStation: 0.5,
  },
  {
    id: 'L2',
    name: '2号线（南北环线）',
    color: '#1e88e5',
    stations: ['S008', 'S002', 'S009', 'S003', 'S005', 'S014', 'S011', 'S019', 'S016', 'S010', 'S008'],
    baseFarePerStation: 0.6,
  },
  {
    id: 'L3',
    name: '3号线（东北射线）',
    color: '#43a047',
    stations: ['S009', 'S012', 'S013', 'S014'],
    baseFarePerStation: 0.7,
  },
  {
    id: 'L4',
    name: '4号线（西北射线）',
    color: '#fb8c00',
    stations: ['S015', 'S002', 'S001', 'S016', 'S017'],
    baseFarePerStation: 0.55,
  },
  {
    id: 'L5',
    name: '5号线（西南射线）',
    color: '#8e24aa',
    stations: ['S018', 'S006', 'S004', 'S016', 'S019'],
    baseFarePerStation: 0.65,
  },
  {
    id: 'L6',
    name: '6号线（东南射线）',
    color: '#00897b',
    stations: ['S019', 'S017', 'S014', 'S007', 'S020'],
    baseFarePerStation: 0.75,
  },
];

export const transferChannels: TransferChannel[] = [
  { fromStation: 'S001', toStation: 'S001', fromLine: 'L1', toLine: 'L2', walkTime: 3, crowdFactor: 1.2 },
  { fromStation: 'S001', toStation: 'S001', fromLine: 'L1', toLine: 'L4', walkTime: 5, crowdFactor: 1.5 },
  { fromStation: 'S001', toStation: 'S001', fromLine: 'L2', toLine: 'L4', walkTime: 4, crowdFactor: 1.3 },
  { fromStation: 'S003', toStation: 'S003', fromLine: 'L1', toLine: 'L3', walkTime: 4, crowdFactor: 1.4 },
  { fromStation: 'S003', toStation: 'S003', fromLine: 'L1', toLine: 'L2', walkTime: 3, crowdFactor: 1.2 },
  { fromStation: 'S003', toStation: 'S003', fromLine: 'L2', toLine: 'L3', walkTime: 5, crowdFactor: 1.4 },
  { fromStation: 'S004', toStation: 'S004', fromLine: 'L1', toLine: 'L5', walkTime: 3, crowdFactor: 1.1 },
  { fromStation: 'S005', toStation: 'S005', fromLine: 'L1', toLine: 'L2', walkTime: 4, crowdFactor: 1.3 },
  { fromStation: 'S007', toStation: 'S007', fromLine: 'L1', toLine: 'L6', walkTime: 5, crowdFactor: 1.5 },
  { fromStation: 'S009', toStation: 'S009', fromLine: 'L2', toLine: 'L3', walkTime: 3, crowdFactor: 1.2 },
  { fromStation: 'S014', toStation: 'S014', fromLine: 'L3', toLine: 'L6', walkTime: 4, crowdFactor: 1.3 },
  { fromStation: 'S014', toStation: 'S014', fromLine: 'L2', toLine: 'L3', walkTime: 5, crowdFactor: 1.4 },
  { fromStation: 'S014', toStation: 'S014', fromLine: 'L2', toLine: 'L6', walkTime: 6, crowdFactor: 1.6 },
  { fromStation: 'S016', toStation: 'S016', fromLine: 'L4', toLine: 'L5', walkTime: 3, crowdFactor: 1.2 },
  { fromStation: 'S017', toStation: 'S017', fromLine: 'L4', toLine: 'L6', walkTime: 4, crowdFactor: 1.3 },
  { fromStation: 'S019', toStation: 'S019', fromLine: 'L5', toLine: 'L6', walkTime: 3, crowdFactor: 1.1 },
];

export const fareConfig: FareConfig = {
  baseFare: 2,
  perStationRate: 0.5,
  peakSurcharge: 0.3,
  hubTransferSurcharge: 1,
  maxFare: 15,
  minFare: 2,
};

export function getStationById(id: string): Station | undefined {
  return stations.find((s) => s.id === id);
}

export function getLineById(id: string): MetroLine | undefined {
  return metroLines.find((l) => l.id === id);
}

export function getTransferChannel(
  station: string,
  fromLine: string,
  toLine: string,
): TransferChannel | undefined {
  return transferChannels.find(
    (t) => t.fromStation === station && t.fromLine === fromLine && t.toLine === toLine,
  );
}

export function getBikeParkingById(id: string): BikeParkingStation | undefined {
  return bikeParkingStations.find((bp) => bp.id === id);
}

export function getBikeParkingByStationId(stationId: string): BikeParkingStation | undefined {
  return bikeParkingStations.find((bp) => bp.stationId === stationId);
}

export function calculateDistanceKm(x1: number, y1: number, x2: number, y2: number): number {
  const pixelDistance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const kmPerPixel = 0.02;
  return Math.round(pixelDistance * kmPerPixel * 10) / 10;
}
