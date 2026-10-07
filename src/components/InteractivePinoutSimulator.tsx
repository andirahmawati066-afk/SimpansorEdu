import React, { useState } from 'react';
import { SensorModule } from '../types';
import { Activity, Sliders, Play, CheckCircle2, AlertTriangle, Cpu, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  sensor: SensorModule;
}

export const InteractivePinoutSimulator: React.FC<Props> = ({ sensor }) => {
  const [selectedPinIndex, setSelectedPinIndex] = useState<number>(0);
  
  // Simulation states
  const [tempValue, setTempValue] = useState<number>(27);
  const [humidityValue, setHumidityValue] = useState<number>(65);
  const [isMotionDetected, setIsMotionDetected] = useState<boolean>(false);
  const [luxValue, setLuxValue] = useState<number>(450);
  const [distanceCm, setDistanceCm] = useState<number>(18);
  const [gasPpm, setGasPpm] = useState<number>(420);
  const [flameDistance, setFlameDistance] = useState<number>(60);

  const selectedPin = sensor.pins[selectedPinIndex] || sensor.pins[0];

  const triggerMotion = () => {
    playSound('select');
    setIsMotionDetected(true);
    setTimeout(() => {
      setIsMotionDetected(false);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 via-cyan-50/40 to-blue-50/60 rounded-3xl border border-sky-200/80 p-6 shadow-[0_12px_40px_-15px_rgba(2,132,199,0.12)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-sky-200/60 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-400/25">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              Virtual Laboratory &amp; Live Signal Inspector
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                Interaktif
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Uji sinyal logika pinout dan simulasi data sensor secara real-time ke Arduino Uno
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: Interactive Pin Inspector */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-sm rounded-2xl border border-sky-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-600" />
              Pinout Terminal Header
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Klik pin untuk inspeksi</span>
          </div>

          <div className="space-y-2">
            {sensor.pins.map((pin, index) => {
              const isSelected = selectedPinIndex === index;
              const typeColor =
                pin.type === 'VCC'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : pin.type === 'GND'
                  ? 'bg-slate-100 text-slate-700 border-slate-300'
                  : pin.type === 'DIGITAL'
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : pin.type === 'ANALOG'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200';

              return (
                <button
                  key={pin.name}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setSelectedPinIndex(index);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-50 to-cyan-50 border-sky-400 shadow-sm ring-2 ring-sky-300/40'
                      : 'hover:bg-slate-50/80 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border ${typeColor}`}>
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{pin.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{pin.arduinoPin}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeColor}`}>
                      {pin.type}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-600 translate-x-0.5' : 'text-slate-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pin Details Box */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-sky-900/90 to-slate-900 text-white shadow-md">
            <div className="flex items-center justify-between text-xs text-sky-200 font-medium mb-1">
              <span>Sambungan Rangkaian:</span>
              <span className="font-mono text-cyan-300 bg-sky-800/80 px-2 py-0.5 rounded border border-sky-700">
                {selectedPin.arduinoPin}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {selectedPin.description}
            </p>
          </div>
        </div>

        {/* Right: Live Interactive Simulation Playground */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-sm rounded-2xl border border-sky-100 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-600" />
                Live Parameter &amp; Sinyal Penginderaan
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Serial Monitor Aktif
              </span>
            </div>

            {/* Dynamic Interactive controls based on sensor ID */}
            {sensor.id === 'dht11' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">Simulasi Temperatur Ambient:</span>
                    <span className="font-bold text-sky-700">{tempValue}°C</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={tempValue}
                    onChange={(e) => setTempValue(Number(e.target.value))}
                    className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">Simulasi Kelembapan Udara (RH):</span>
                    <span className="font-bold text-cyan-700">{humidityValue}% RH</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    value={humidityValue}
                    onChange={(e) => setHumidityValue(Number(e.target.value))}
                    className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>

                <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-200">
                  <div className="text-cyan-400 mb-1">// Paket Transmisi 1-Wire 40-Bit Terhitung:</div>
                  <div className="text-slate-400">Byte 1 (RH Int): <span className="text-emerald-400">{humidityValue}</span> | Byte 3 (Temp Int): <span className="text-amber-400">{tempValue}</span></div>
                  <div className="text-slate-400">Checksum (Byte 5): <span className="text-sky-300">{(humidityValue + tempValue) & 0xFF} [VALID]</span></div>
                </div>
              </div>
            )}

            {sensor.id === 'pir' && (
              <div className="space-y-5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  PIR mengindera perubahan radiasi inframerah dari manusia yang bergerak melintasi kubah lensa Fresnel.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    type="button"
                    onClick={triggerMotion}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Gerakkan Objek di Depan Sensor
                  </button>
                  <div
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isMotionDetected
                        ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    Status: {isMotionDetected ? 'GERAKAN TERDETEKSI (HIGH / 3.3V)' : 'DIAM / STANDBY (LOW / 0V)'}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-200">
                  <div className="text-cyan-400">// Pin D7 Arduino Digital Read:</div>
                  <div className={isMotionDetected ? 'text-emerald-400' : 'text-slate-500'}>
                    digitalRead(7) =&gt; {isMotionDetected ? 'HIGH (1)' : 'LOW (0)'}
                  </div>
                </div>
              </div>
            )}

            {sensor.id === 'hc-sr04' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">Jarak Objek Pantul:</span>
                    <span className="font-bold text-sky-700">{distanceCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="400"
                    value={distanceCm}
                    onChange={(e) => setDistanceCm(Number(e.target.value))}
                    className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                </div>

                <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-200">
                  <div className="text-cyan-400 mb-1">// Kalkulasi pulseIn() Mikrodetik:</div>
                  <div className="text-slate-300">
                    Durasi Echo: <span className="text-amber-400">{Math.round((distanceCm * 2) / 0.0343)} µs</span>
                  </div>
                  <div className="text-emerald-400">
                    Jarak = ({Math.round((distanceCm * 2) / 0.0343)} * 0.0343) / 2 = {distanceCm} cm
                  </div>
                </div>
              </div>
            )}

            {sensor.id === 'ldr' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">Intensitas Cahaya Permukaan:</span>
                    <span className="font-bold text-amber-600">{luxValue} Lux ({luxValue > 500 ? 'Terang' : 'Gelap/Remang'})</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    value={luxValue}
                    onChange={(e) => setLuxValue(Number(e.target.value))}
                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-200">
                  <div className="text-cyan-400 mb-1">// Pembagi Tegangan Pin A0 &amp; Komparator D0:</div>
                  <div className="text-slate-300">Analog ADC A0: <span className="text-sky-300">{Math.round((1 - luxValue / 1000) * 1023)} (0-1023)</span></div>
                  <div className="text-slate-300">Digital D8: <span className={luxValue > 500 ? 'text-emerald-400' : 'text-rose-400'}>{luxValue > 500 ? 'LOW (0)' : 'HIGH (1)'}</span></div>
                </div>
              </div>
            )}

            {sensor.id === 'mq2' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">Konsentrasi Gas / Asap:</span>
                    <span className="font-bold text-rose-600">{gasPpm} PPM</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    value={gasPpm}
                    onChange={(e) => setGasPpm(Number(e.target.value))}
                    className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />
                </div>

                <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-200">
                  <div className="text-cyan-400 mb-1">// Ambang Bahaya LM393 Threshold:</div>
                  <div className="text-slate-300">Status DO: <span className={gasPpm > 600 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{gasPpm > 600 ? 'ALARM AKTIF (BAHAYA GAS BOCOR)' : 'AMAN (NORMAL)'}</span></div>
                </div>
              </div>
            )}

            {sensor.id !== 'dht11' && sensor.id !== 'pir' && sensor.id !== 'hc-sr04' && sensor.id !== 'ldr' && sensor.id !== 'mq2' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">Parameter Uji Sensor:</span>
                    <span className="font-bold text-sky-700">{flameDistance}% Stimulus</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={flameDistance}
                    onChange={(e) => setFlameDistance(Number(e.target.value))}
                    className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                </div>

                <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-200">
                  <div className="text-cyan-400 mb-1">// Pembacaan Real-Time Mikrokontroler:</div>
                  <div className="text-slate-300">ADC 10-Bit: <span className="text-emerald-400">{Math.round((flameDistance / 100) * 1023)}</span> | Status Logika: <span className="text-sky-300">{flameDistance > 50 ? 'TRIGGERED (1)' : 'STANDBY (0)'}</span></div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Kompatibilitas: Arduino Uno R3 / R4, Nano, ESP32, STM32</span>
            <span className="text-emerald-600 font-medium">Auto-calibrated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
