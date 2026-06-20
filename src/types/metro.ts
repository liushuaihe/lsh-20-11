export type RouteStrategy = 'shortest-time' | 'min-transfers' | 'lowest-fare' | 'low-carbon';

export type TimePeriod = 'morning-peak' | 'evening-peak' | 'off-peak';

export type TravelMode = 'metro-only' | 'bike-feeder';

export interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  lines: string[];
  isHub: boolean;
  bikeParking?: BikeParkingStation;
}

export interface BikeParkingStation {
  id: string;
  name: string;
  stationId: string;
  totalSpots: number;
  availableSpots: number;
  unitPricePerHour: number;
  unlockFee: number;
  x: number;
  y: number;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: string[];
  baseFarePerStation: number;
}

export interface TransferChannel {
  fromStation: string;
  toStation: string;
  fromLine: string;
  toLine: string;
  walkTime: number;
  crowdFactor: number;
}

export interface Edge {
  from: string;
  to: string;
  line: string;
  baseTime: number;
}

export interface FareConfig {
  baseFare: number;
  perStationRate: number;
  peakSurcharge: number;
  hubTransferSurcharge: number;
  maxFare: number;
  minFare: number;
}

export interface PathSegment {
  fromStation: string;
  toStation: string;
  line: string;
  stationCount: number;
  travelTime: number;
  fare: number;
}

export interface TransferInfo {
  station: string;
  fromLine: string;
  toLine: string;
  walkTime: number;
  penalty: number;
}

export interface BikeFeederSegment {
  type: 'bike-to-station' | 'bike-from-station';
  bikeParkingId: string;
  bikeParkingName: string;
  distanceKm: number;
  bikeTimeMinutes: number;
  bikeCost: number;
  carbonSavedGrams: number;
}

export interface RouteResult {
  segments: PathSegment[];
  transfers: TransferInfo[];
  totalTime: number;
  totalFare: number;
  transferCount: number;
  stationCount: number;
  strategy: RouteStrategy;
  travelMode: TravelMode;
  bikeFeeder?: {
    toStation?: BikeFeederSegment;
    fromStation?: BikeFeederSegment;
    totalBikeTime: number;
    totalBikeCost: number;
  };
  carbonEmissionGrams: number;
  carbonSavedGrams: number;
  moneySaved: number;
  baselineFare: number;
  baselineCarbonGrams: number;
}

export interface LowCarbonConfig {
  carEmissionPerKm: number;
  busEmissionPerKm: number;
  metroEmissionPerKm: number;
  bikeEmissionPerKm: number;
  avgCarSpeedKmh: number;
  avgBikeSpeedKmh: number;
  avgBusSpeedKmh: number;
  stationDistanceKm: number;
  bikeUnlockFee: number;
  bikeRatePerKm: number;
  bikeMaxCostPerTrip: number;
}
