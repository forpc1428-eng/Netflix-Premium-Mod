import { useState, useRef } from 'react';
import { TicketPreset } from '../types';
import { savePreset, exportPreset, importPreset, imageToBase64, getPresets, deletePreset, setActivePresetId } from '../storage';
import { createDefaultPreset } from '../defaultPreset';
import { v4 as uuidv4 } from 'uuid';

interface AdminViewProps {
  preset: TicketPreset | undefined;
  onBack: () => void;
  onPresetUpdated: (preset: TicketPreset) => void;
}

type AdminTab = 'general' | 'appearance' | 'logo' | 'fields' | 'presets';

export default function AdminView({ preset, onBack, onPresetUpdated }: AdminViewProps) {
  const [editPreset, setEditPreset] = useState<TicketPreset>(
    preset ? { ...preset } : createDefaultPreset()
  );
  const [activeTab, setActiveTab] = useState<AdminTab>('general');
  const [saved, setSaved] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const bgInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const allPresets = getPresets();

  const update = <K extends keyof TicketPreset>(key: K, value: TicketPreset[K]) => {
    setEditPreset((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    savePreset(editPreset);
    onPresetUpdated(editPreset);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const b64 = await imageToBase64(file);
      update('backgroundImage', b64);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const b64 = await imageToBase64(file);
      update('logoImage', b64);
    }
  };

  const handleExport = () => {
    exportPreset(editPreset);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importPreset(file);
        setEditPreset(imported);
        onPresetUpdated(imported);
        setImportStatus('✅ Preset imported successfully!');
        setTimeout(() => setImportStatus(''), 3000);
      } catch (err: any) {
        setImportStatus(`❌ ${err.message}`);
        setTimeout(() => setImportStatus(''), 3000);
      }
    }
  };

  const handleNewPreset = () => {
    const newPreset = createDefaultPreset();
    newPreset.id = uuidv4();
    newPreset.name = `Preset ${allPresets.length + 1}`;
    savePreset(newPreset);
    setActivePresetId(newPreset.id);
    setEditPreset(newPreset);
    onPresetUpdated(newPreset);
  };

  const handleDeletePreset = (id: string) => {
    deletePreset(id);
    const remaining = getPresets();
    if (remaining.length > 0) {
      setActivePresetId(remaining[0].id);
      setEditPreset(remaining[0]);
      onPresetUpdated(remaining[0]);
    } else {
      handleNewPreset();
    }
  };

  const handleSwitchPreset = (p: TicketPreset) => {
    setActivePresetId(p.id);
    setEditPreset({ ...p });
    onPresetUpdated(p);
  };

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'appearance', label: 'Theme', icon: '🎨' },
    { id: 'logo', label: 'Logo', icon: '🖼️' },
    { id: 'fields', label: 'Fields', icon: '📝' },
    { id: 'presets', label: 'Presets', icon: '💾' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 bg-slate-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <p className="text-xs opacity-60">Configure ticket presets</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            saved ? 'bg-emerald-500 text-white' : 'bg-white text-slate-800 active:scale-95'
          }`}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      {/* Tabs */}
      <div className="px-2 py-2 bg-slate-700 flex gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-slate-800 shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-4 animate-fade-in">
            <FieldGroup label="Preset Name">
              <input
                type="text"
                value={editPreset.name}
                onChange={(e) => update('name', e.target.value)}
                className="input-field"
              />
            </FieldGroup>
            <FieldGroup label="Header Title">
              <input
                type="text"
                value={editPreset.headerTitle}
                onChange={(e) => update('headerTitle', e.target.value)}
                className="input-field"
              />
            </FieldGroup>
            <FieldGroup label="Header Subtitle">
              <input
                type="text"
                value={editPreset.headerSubtitle}
                onChange={(e) => update('headerSubtitle', e.target.value)}
                className="input-field"
              />
            </FieldGroup>
            <FieldGroup label="Fare Label">
              <input
                type="text"
                value={editPreset.fareLabel}
                onChange={(e) => update('fareLabel', e.target.value)}
                className="input-field"
              />
            </FieldGroup>
            <FieldGroup label="Default Fare Amount">
              <input
                type="number"
                value={editPreset.fare}
                onChange={(e) => update('fare', Number(e.target.value))}
                className="input-field"
              />
            </FieldGroup>
            <FieldGroup label="Currency Symbol">
              <input
                type="text"
                value={editPreset.currency}
                onChange={(e) => update('currency', e.target.value)}
                className="input-field"
              />
            </FieldGroup>
            <FieldGroup label="Ticket Validity">
              <div className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-700">
                All tickets expire at 11:59 PM on the day of purchase
              </div>
            </FieldGroup>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-4 animate-fade-in">
            <FieldGroup label="Header Color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={editPreset.headerColor}
                  onChange={(e) => update('headerColor', e.target.value)}
                />
                <span className="text-sm font-mono text-slate-500">{editPreset.headerColor}</span>
              </div>
            </FieldGroup>
            <FieldGroup label="Header Text Color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={editPreset.headerTextColor}
                  onChange={(e) => update('headerTextColor', e.target.value)}
                />
                <span className="text-sm font-mono text-slate-500">{editPreset.headerTextColor}</span>
              </div>
            </FieldGroup>
            <FieldGroup label="Divider Color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={editPreset.dividerColor}
                  onChange={(e) => update('dividerColor', e.target.value)}
                />
                <span className="text-sm font-mono text-slate-500">{editPreset.dividerColor}</span>
              </div>
            </FieldGroup>
            <FieldGroup label="Background Image">
              <input type="file" accept="image/*" ref={bgInputRef} onChange={handleBgUpload} className="hidden" />
              <div className="flex gap-2">
                <button
                  onClick={() => bgInputRef.current?.click()}
                  className="flex-1 py-3 bg-primary/10 text-primary rounded-xl text-sm font-semibold active:scale-95 transition-transform"
                >
                  Upload Background
                </button>
                {editPreset.backgroundImage && (
                  <button
                    onClick={() => update('backgroundImage', '')}
                    className="px-3 py-3 bg-red-50 text-red-500 rounded-xl text-sm font-semibold"
                  >
                    ✕
                  </button>
                )}
              </div>
              {editPreset.backgroundImage && (
                <img src={editPreset.backgroundImage} alt="BG" className="mt-2 w-full h-24 object-cover rounded-xl opacity-50" />
              )}
            </FieldGroup>
            <FieldGroup label="Font Family">
              <select
                value={editPreset.fontSettings.family}
                onChange={(e) =>
                  update('fontSettings', { ...editPreset.fontSettings, family: e.target.value })
                }
                className="input-field"
              >
                <option value="system-ui, -apple-system, sans-serif">System Default</option>
                <option value="'Segoe UI', Tahoma, Geneva, sans-serif">Segoe UI</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="monospace">Monospace</option>
              </select>
            </FieldGroup>
            <FieldGroup label={`Header Font Size: ${editPreset.fontSettings.headerSize}px`}>
              <input
                type="range"
                min={12}
                max={32}
                value={editPreset.fontSettings.headerSize}
                onChange={(e) =>
                  update('fontSettings', { ...editPreset.fontSettings, headerSize: Number(e.target.value) })
                }
                className="w-full"
              />
            </FieldGroup>
            <FieldGroup label={`Body Font Size: ${editPreset.fontSettings.bodySize}px`}>
              <input
                type="range"
                min={10}
                max={24}
                value={editPreset.fontSettings.bodySize}
                onChange={(e) =>
                  update('fontSettings', { ...editPreset.fontSettings, bodySize: Number(e.target.value) })
                }
                className="w-full"
              />
            </FieldGroup>
            <FieldGroup label={`Fare Font Size: ${editPreset.fontSettings.fareSize}px`}>
              <input
                type="range"
                min={16}
                max={48}
                value={editPreset.fontSettings.fareSize}
                onChange={(e) =>
                  update('fontSettings', { ...editPreset.fontSettings, fareSize: Number(e.target.value) })
                }
                className="w-full"
              />
            </FieldGroup>
            <FieldGroup label={`Timer Font Size: ${editPreset.fontSettings.timerSize}px`}>
              <input
                type="range"
                min={20}
                max={56}
                value={editPreset.fontSettings.timerSize}
                onChange={(e) =>
                  update('fontSettings', { ...editPreset.fontSettings, timerSize: Number(e.target.value) })
                }
                className="w-full"
              />
            </FieldGroup>
          </div>
        )}

        {/* Logo Tab */}
        {activeTab === 'logo' && (
          <div className="space-y-4 animate-fade-in">
            <FieldGroup label="Logo Image">
              <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />
              <div className="flex gap-2">
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="flex-1 py-3 bg-primary/10 text-primary rounded-xl text-sm font-semibold active:scale-95 transition-transform"
                >
                  Upload Logo
                </button>
                {editPreset.logoImage && (
                  <button
                    onClick={() => update('logoImage', '')}
                    className="px-3 py-3 bg-red-50 text-red-500 rounded-xl text-sm font-semibold"
                  >
                    ✕
                  </button>
                )}
              </div>
              {editPreset.logoImage && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={editPreset.logoImage}
                    alt="Logo"
                    className="rounded-full object-cover border-2 border-slate-200"
                    style={{ width: editPreset.logoSize, height: editPreset.logoSize }}
                  />
                </div>
              )}
            </FieldGroup>
            <FieldGroup label={`Logo Size: ${editPreset.logoSize}px`}>
              <input
                type="range"
                min={32}
                max={128}
                value={editPreset.logoSize}
                onChange={(e) => update('logoSize', Number(e.target.value))}
                className="w-full"
              />
            </FieldGroup>
            <FieldGroup label="Logo Animation">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Enable Zoom Animation</span>
                  <input
                    type="checkbox"
                    checked={editPreset.logoAnimation.zoomEnabled}
                    onChange={(e) =>
                      update('logoAnimation', { ...editPreset.logoAnimation, zoomEnabled: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-primary"
                  />
                </label>
                <div>
                  <label className="text-xs text-slate-500">Min Scale: {editPreset.logoAnimation.zoomMin}</label>
                  <input
                    type="range"
                    min={0.9}
                    max={1.0}
                    step={0.01}
                    value={editPreset.logoAnimation.zoomMin}
                    onChange={(e) =>
                      update('logoAnimation', { ...editPreset.logoAnimation, zoomMin: Number(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Max Scale: {editPreset.logoAnimation.zoomMax}</label>
                  <input
                    type="range"
                    min={1.0}
                    max={1.2}
                    step={0.01}
                    value={editPreset.logoAnimation.zoomMax}
                    onChange={(e) =>
                      update('logoAnimation', { ...editPreset.logoAnimation, zoomMax: Number(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Duration: {editPreset.logoAnimation.duration}ms</label>
                  <input
                    type="range"
                    min={1000}
                    max={8000}
                    step={500}
                    value={editPreset.logoAnimation.duration}
                    onChange={(e) =>
                      update('logoAnimation', { ...editPreset.logoAnimation, duration: Number(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </FieldGroup>
            {/* Live Preview */}
            {editPreset.logoImage && editPreset.logoAnimation.zoomEnabled && (
              <FieldGroup label="Live Preview">
                <div className="flex justify-center py-4">
                  <div
                    className="logo-animate rounded-full"
                    style={{
                      '--zoom-min': editPreset.logoAnimation.zoomMin,
                      '--zoom-max': editPreset.logoAnimation.zoomMax,
                      '--zoom-duration': `${editPreset.logoAnimation.duration}ms`,
                    } as React.CSSProperties}
                  >
                    <img
                      src={editPreset.logoImage}
                      alt="Preview"
                      className="rounded-full object-cover"
                      style={{ width: editPreset.logoSize, height: editPreset.logoSize }}
                    />
                  </div>
                </div>
              </FieldGroup>
            )}
          </div>
        )}

        {/* Fields Tab */}
        {activeTab === 'fields' && (
          <div className="space-y-4 animate-fade-in">
            <FieldGroup label="Editable Field Controls">
              <p className="text-xs text-slate-400 mb-3">
                Control which fields users can edit when generating tickets.
              </p>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-sm font-medium text-slate-700">Passenger Name</span>
                    <p className="text-xs text-slate-400">Allow users to enter name</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editPreset.editableFields.name}
                    onChange={(e) =>
                      update('editableFields', { ...editPreset.editableFields, name: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-sm font-medium text-slate-700">Fare Amount</span>
                    <p className="text-xs text-slate-400">Allow fare modification</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editPreset.editableFields.fare}
                    onChange={(e) =>
                      update('editableFields', { ...editPreset.editableFields, fare: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-sm font-medium text-slate-700">Validity Duration</span>
                    <p className="text-xs text-slate-400">Allow validity change</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editPreset.editableFields.validity}
                    onChange={(e) =>
                      update('editableFields', { ...editPreset.editableFields, validity: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-primary"
                  />
                </label>
              </div>
            </FieldGroup>
            <FieldGroup label={`Ticket ID Font Size: ${editPreset.fontSettings.ticketIdSize}px`}>
              <input
                type="range"
                min={8}
                max={18}
                value={editPreset.fontSettings.ticketIdSize}
                onChange={(e) =>
                  update('fontSettings', { ...editPreset.fontSettings, ticketIdSize: Number(e.target.value) })
                }
                className="w-full"
              />
            </FieldGroup>
          </div>
        )}

        {/* Presets Tab */}
        {activeTab === 'presets' && (
          <div className="space-y-4 animate-fade-in">
            {/* Export/Import */}
            <FieldGroup label="Export / Import">
              <div className="space-y-3">
                <button
                  onClick={handleExport}
                  className="w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Current Preset
                </button>
                <input type="file" accept=".json" ref={importInputRef} onChange={handleImport} className="hidden" />
                <button
                  onClick={() => importInputRef.current?.click()}
                  className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Import Preset (.json)
                </button>
                {importStatus && (
                  <div className="text-sm text-center py-2 px-3 rounded-lg bg-slate-50">
                    {importStatus}
                  </div>
                )}
              </div>
            </FieldGroup>

            {/* Saved Presets */}
            <FieldGroup label="Saved Presets">
              <div className="space-y-2">
                {allPresets.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      editPreset.id === p.id
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: p.headerColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-700 truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.currency}{p.fare} • Until 11:59 PM
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSwitchPreset(p)}
                        className="px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-lg"
                      >
                        Use
                      </button>
                      {allPresets.length > 1 && (
                        <button
                          onClick={() => handleDeletePreset(p.id)}
                          className="px-2 py-1 text-xs font-semibold text-red-500 bg-red-50 rounded-lg"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </FieldGroup>

            {/* New Preset */}
            <button
              onClick={handleNewPreset}
              className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl text-sm font-semibold active:scale-95 transition-transform"
            >
              + Create New Preset
            </button>
          </div>
        )}
      </div>

      {/* Bottom Safe Area */}
      <div className="h-6" />
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
        {label}
      </label>
      {children}
    </div>
  );
}
