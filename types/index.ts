import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface WeatherLocation {
  name: string;
  lat: number;
  lon: number;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  icon: string;
}

export interface GeocodeLocation {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}
