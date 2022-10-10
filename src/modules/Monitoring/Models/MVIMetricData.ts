import { SparklineModel } from '@realmocean/charts';
export interface MVIMetricData {
    name: string,
    chart: SparklineModel,
    value: string,
    subValue: string
}