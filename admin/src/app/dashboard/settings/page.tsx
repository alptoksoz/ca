'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { tenantApi, Tenant, UpdateTenantDto } from '@/lib/api/services/tenant';
import {
  Store,
  Clock,
  Palette,
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';

type Tab = 'basic' | 'hours' | 'branding';

const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const queryClient = useQueryClient();
  const tenantId = '1'; // Mock - get from auth context

  // Fetch tenant data
  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantApi.getTenant(tenantId),
  });

  // Basic info state
  const [basicInfo, setBasicInfo] = useState<UpdateTenantDto>({});
  const [basicInfoDirty, setBasicInfoDirty] = useState(false);

  // Operating hours state
  const [operatingHours, setOperatingHours] = useState<
    Record<string, { open: string; close: string; closed: boolean }>
  >({});
  const [hoursDirty, setHoursDirty] = useState(false);

  // Branding state
  const [branding, setBranding] = useState({
    primaryColor: '',
    secondaryColor: '',
    logoUrl: '',
  });
  const [brandingDirty, setBrandingDirty] = useState(false);

  // Initialize form data when tenant loads
  React.useEffect(() => {
    if (tenant) {
      setBasicInfo({
        name: tenant.name,
        description: tenant.description,
        address: tenant.address,
        city: tenant.city,
        state: tenant.state,
        zipCode: tenant.zipCode,
        country: tenant.country,
        phoneNumber: tenant.phoneNumber,
        email: tenant.email,
        latitude: tenant.latitude,
        longitude: tenant.longitude,
      });

      setOperatingHours(
        tenant.operatingHours || {
          monday: { open: '07:00', close: '20:00', closed: false },
          tuesday: { open: '07:00', close: '20:00', closed: false },
          wednesday: { open: '07:00', close: '20:00', closed: false },
          thursday: { open: '07:00', close: '20:00', closed: false },
          friday: { open: '07:00', close: '20:00', closed: false },
          saturday: { open: '08:00', close: '21:00', closed: false },
          sunday: { open: '08:00', close: '21:00', closed: false },
        }
      );

      setBranding({
        primaryColor: tenant.branding?.primaryColor || '#6F4E37',
        secondaryColor: tenant.branding?.secondaryColor || '#D4A574',
        logoUrl: tenant.branding?.logoUrl || '',
      });
    }
  }, [tenant]);

  // Update mutations
  const updateBasicInfoMutation = useMutation({
    mutationFn: (data: UpdateTenantDto) => tenantApi.updateTenant(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
      setBasicInfoDirty(false);
    },
  });

  const updateHoursMutation = useMutation({
    mutationFn: (hours: Record<string, { open: string; close: string; closed: boolean }>) =>
      tenantApi.updateOperatingHours(tenantId, hours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
      setHoursDirty(false);
    },
  });

  const updateBrandingMutation = useMutation({
    mutationFn: (brandingData: {
      primaryColor?: string;
      secondaryColor?: string;
      logoUrl?: string;
    }) => tenantApi.updateBranding(tenantId, brandingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
      setBrandingDirty(false);
    },
  });

  const handleSaveBasicInfo = () => {
    updateBasicInfoMutation.mutate(basicInfo);
  };

  const handleSaveHours = () => {
    updateHoursMutation.mutate(operatingHours);
  };

  const handleSaveBranding = () => {
    updateBrandingMutation.mutate(branding);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your coffee shop settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('basic')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                ${
                  activeTab === 'basic'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Store className="w-4 h-4" />
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                ${
                  activeTab === 'hours'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Clock className="w-4 h-4" />
              Operating Hours
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                ${
                  activeTab === 'branding'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Palette className="w-4 h-4" />
              Branding
            </button>
          </nav>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={basicInfo.name || ''}
                    onChange={(e) => {
                      setBasicInfo({ ...basicInfo, name: e.target.value });
                      setBasicInfoDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={basicInfo.description || ''}
                    onChange={(e) => {
                      setBasicInfo({ ...basicInfo, description: e.target.value });
                      setBasicInfoDirty(true);
                    }}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={basicInfo.address || ''}
                    onChange={(e) => {
                      setBasicInfo({ ...basicInfo, address: e.target.value });
                      setBasicInfoDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={basicInfo.city || ''}
                    onChange={(e) => {
                      setBasicInfo({ ...basicInfo, city: e.target.value });
                      setBasicInfoDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={basicInfo.state || ''}
                    onChange={(e) => {
                      setBasicInfo({ ...basicInfo, state: e.target.value });
                      setBasicInfoDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={basicInfo.zipCode || ''}
                    onChange={(e) => {
                      setBasicInfo({ ...basicInfo, zipCode: e.target.value });
                      setBasicInfoDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={basicInfo.country || ''}
                    onChange={(e) => {
                      setBasicInfo({ ...basicInfo, country: e.target.value });
                      setBasicInfoDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={basicInfo.phoneNumber || ''}
                    onChange={(e) => {
                      setBasicInfo({ ...basicInfo, phoneNumber: e.target.value });
                      setBasicInfoDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={basicInfo.email || ''}
                    onChange={(e) => {
                      setBasicInfo({ ...basicInfo, email: e.target.value });
                      setBasicInfoDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={basicInfo.latitude || ''}
                    onChange={(e) => {
                      setBasicInfo({
                        ...basicInfo,
                        latitude: parseFloat(e.target.value),
                      });
                      setBasicInfoDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={basicInfo.longitude || ''}
                    onChange={(e) => {
                      setBasicInfo({
                        ...basicInfo,
                        longitude: parseFloat(e.target.value),
                      });
                      setBasicInfoDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={handleSaveBasicInfo}
                  disabled={!basicInfoDirty || updateBasicInfoMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateBasicInfoMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Operating Hours Tab */}
        {activeTab === 'hours' && (
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="w-32">
                    <span className="font-medium text-gray-900">
                      {DAY_LABELS[day]}
                    </span>
                  </div>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={operatingHours[day]?.closed || false}
                      onChange={(e) => {
                        setOperatingHours({
                          ...operatingHours,
                          [day]: {
                            ...operatingHours[day],
                            closed: e.target.checked,
                          },
                        });
                        setHoursDirty(true);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Closed</span>
                  </label>

                  {!operatingHours[day]?.closed && (
                    <>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Open:</label>
                        <input
                          type="time"
                          value={operatingHours[day]?.open || ''}
                          onChange={(e) => {
                            setOperatingHours({
                              ...operatingHours,
                              [day]: {
                                ...operatingHours[day],
                                open: e.target.value,
                              },
                            });
                            setHoursDirty(true);
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Close:</label>
                        <input
                          type="time"
                          value={operatingHours[day]?.close || ''}
                          onChange={(e) => {
                            setOperatingHours({
                              ...operatingHours,
                              [day]: {
                                ...operatingHours[day],
                                close: e.target.value,
                              },
                            });
                            setHoursDirty(true);
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={handleSaveHours}
                  disabled={!hoursDirty || updateHoursMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateHoursMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Primary Color
                  </label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => {
                        setBranding({ ...branding, primaryColor: e.target.value });
                        setBrandingDirty(true);
                      }}
                      className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => {
                        setBranding({ ...branding, primaryColor: e.target.value });
                        setBrandingDirty(true);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="#6F4E37"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    This color will be used for buttons, links, and accents in your mobile app
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Secondary Color
                  </label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => {
                        setBranding({ ...branding, secondaryColor: e.target.value });
                        setBrandingDirty(true);
                      }}
                      className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.secondaryColor}
                      onChange={(e) => {
                        setBranding({ ...branding, secondaryColor: e.target.value });
                        setBrandingDirty(true);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="#D4A574"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Secondary color for backgrounds and highlights
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={branding.logoUrl}
                    onChange={(e) => {
                      setBranding({ ...branding, logoUrl: e.target.value });
                      setBrandingDirty(true);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/logo.png"
                  />
                  {branding.logoUrl && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Logo Preview:
                      </p>
                      <img
                        src={branding.logoUrl}
                        alt="Logo preview"
                        className="h-20 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Color Preview */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Preview:
                  </p>
                  <div className="flex gap-4">
                    <div className="flex-1 p-6 rounded-lg text-white text-center font-medium"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      Primary Color
                    </div>
                    <div className="flex-1 p-6 rounded-lg text-white text-center font-medium"
                      style={{ backgroundColor: branding.secondaryColor }}
                    >
                      Secondary Color
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={handleSaveBranding}
                  disabled={!brandingDirty || updateBrandingMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateBrandingMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
