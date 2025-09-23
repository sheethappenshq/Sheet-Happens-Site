export default function WeatherWidget() {
  return (
    <div className="bg-blue-200 text-blue-900 p-3 border-2 border-muted text-center">
      <h3 className="font-bold mb-2 uppercase text-xs">WEATHER</h3>
      <div className="text-xs">
        <div>Partly Cloudy</div>
        <div className="text-lg font-bold">72°F</div>
        <div>Humidity: 65%</div>
      </div>
    </div>
  );
}