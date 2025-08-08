import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import debounce from "lodash.debounce";
import api from "../../lib/interceptor";
import { Filter } from "lucide-react";

const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 31.5204, lng: 74.3587 }; // a sane default (e.g., Lahore)

export default function BusinessListPage() {
  const [businesses, setBusinesses] = useState([]);
  const [count, setCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const [category, setCategory] = useState("");
  const [province, setProvince] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  // Map & selection
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const mapRef = useRef(null);

  // Map zoom control (we still rely on google map UI but expose buttons)
  const [zoom, setZoom] = useState(6);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
    id: "google-map-script",
  });

  // --- Fetch categories & provinces once ---
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catResp, provResp] = await Promise.all([
          api.get("/afghan/category/"),
          api.get("/afghan/province/"),
        ]);
        setCategories(catResp.data || []);
        setProvinces(provResp.data || []);
      } catch (err) {
        console.error("Failed to fetch categories/provinces", err);
      }
    };
    fetchFilters();
  }, []);

  // Build query URL for fetching businesses (page param will be handled separately)
  const buildListUrl = (base = "/afghan/business/") => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (province) params.append("province", province);
    if (search) params.append("search", search.trim());
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  // Fetch page (either base or next/previous absolute URLs)
  const fetchPage = useCallback(
    async (pageUrl = null) => {
      setLoading(true);
      try {
        const url = pageUrl || buildListUrl();
        // If pageUrl is absolute (next/prev), axios can call it directly; else use relative
        const resp = await api.get(url);
        const data = resp.data;
        setBusinesses(data.results || []);
        setCount(data.count || 0);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
        // optionally choose selectedBusiness to null when result set changes
        setSelectedBusiness(null);
        // Fit map to markers once data loaded
        fitMapToMarkers(data.results || []);
      } catch (err) {
        console.error("Failed to fetch businesses", err);
      } finally {
        setLoading(false);
      }
    },
    [category, province, search] // rebuild when filters change
  );

  // Debounce search changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useMemo(() => debounce(fetchPage, 400), [fetchPage]);

  // Trigger fetch when filters or search change
  useEffect(() => {
    debouncedFetch(); // debounced fetch
    return () => debouncedFetch.cancel();
  }, [category, province, search, debouncedFetch]);

  // On mount fetch first page
  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* Map helpers */
  const fitMapToMarkers = (items) => {
    if (!isLoaded || !mapRef.current || !items || items.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    let any = false;
    items.forEach((b) => {
      const lat = parseFloat(b.latitude);
      const lng = parseFloat(b.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.extend({ lat, lng });
        any = true;
      }
    });
    if (any) {
      mapRef.current.fitBounds(bounds);
    } else {
      mapRef.current.setCenter(defaultCenter);
      mapRef.current.setZoom(zoom);
    }
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
    // fit any already-loaded markers
    fitMapToMarkers(businesses);
  };

  const handleCardClick = (biz) => {
    setSelectedBusiness(biz);
    // center map on clicked business
    if (mapRef.current) {
      const lat = parseFloat(biz.latitude);
      const lng = parseFloat(biz.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
      }
    }
    // placeholder: you said you'll use the click for a details page later
    // e.g., navigate(`/business/${biz.id}`);
  };

  const handleNext = () => {
    if (nextUrl) fetchPage(nextUrl);
  };
  const handlePrev = () => {
    if (prevUrl) fetchPage(prevUrl);
  };

  const changeZoom = (delta) => {
    const newZoom = Math.max(2, Math.min(20, (mapRef.current?.getZoom?.() || zoom) + delta));
    setZoom(newZoom);
    if (mapRef.current) mapRef.current.setZoom(newZoom);
  };

  if (loadError) {
    console.error("Map load error:", loadError);
  }

  return (
    <div className="min-h-screen px-2 py-2 space-y-6 bg-slate-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Business Directory</h1>
          <p className="text-gray-600 mt-2">Find businesses and view them on the map.</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="flex-1">
            <label className="sr-only">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or address..."
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 min-w-[160px] focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name || c.category_name || c.title || `Category ${c.id}`}</option>
              ))}
            </select>

            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="border rounded-lg px-3 py-2 min-w-[160px] focus:outline-none"
            >
              <option value="">All Provinces</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>{p.name || p.province_name || p.title || `Province ${p.id}`}</option>
              ))}
            </select>


            <button
              onClick={() => {
                // Check if all values are empty, then do not perform the action
                if (search || category || province) {
                  setSearch("");
                  setCategory("");
                  setProvince("");
                  fetchPage();
                }
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100"
            >
              <Filter className="w-4 h-4 text-gray-600" /> Reset
            </button>

          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left list */}
          <div className="md:w-1/2 lg:w-2/5 border-r overflow-auto" style={{ height: "72vh" }}>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Showing <span className="font-semibold">{businesses.length}</span> of {count}</div>
                <div className="text-xs text-slate-500">Page navigation</div>
              </div>

              {loading && <div className="text-center text-slate-500">Loading...</div>}

              {businesses.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleCardClick(b)}
                  className="p-3 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer bg-white flex gap-3"
                >
                  <div className="w-20 h-20 rounded-md bg-slate-100 overflow-hidden flex-shrink-0">
                    {b.image_url ? (
                      <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-800">{b.name}</h3>
                      <div className="text-xs text-slate-500">{b.contact_phone}</div>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{b.category_name}</div>
                    <div className="text-xs text-slate-400 mt-2 line-clamp-2">{b.address}</div>
                  </div>
                </div>
              ))}

              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={handlePrev}
                  disabled={!prevUrl}
                  className={`px-3 py-2 rounded-md border ${prevUrl ? "hover:bg-slate-100" : "opacity-50 cursor-not-allowed"}`}
                >
                  ← Previous
                </button>

                <div className="text-sm text-slate-500">Total: {count}</div>

                <button
                  onClick={handleNext}
                  disabled={!nextUrl}
                  className={`px-3 py-2 rounded-md border ${nextUrl ? "hover:bg-slate-100" : "opacity-50 cursor-not-allowed"}`}
                >
                  Next →
                </button>
              </div>

            </div>
          </div>

          {/* Right map */}
          <div className="md:flex-1 relative" style={{ height: "72vh" }}>
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
              <button
                onClick={() => changeZoom(1)}
                className="bg-white shadow rounded-md px-3 py-2 hover:bg-slate-50"
              >
                +
              </button>
              <button
                onClick={() => changeZoom(-1)}
                className="bg-white shadow rounded-md px-3 py-2 hover:bg-slate-50"
              >
                −
              </button>
            </div>

            {!isLoaded ? (
              <div className="h-full w-full flex items-center justify-center text-slate-500">Loading map...</div>
            ) : (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={zoom}
                onLoad={onMapLoad}
                options={{
                  clickableIcons: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  zoomControl: true,
                }}
              >
                {businesses.map((b) => {
                  const lat = parseFloat(b.latitude);
                  const lng = parseFloat(b.longitude);
                  if (isNaN(lat) || isNaN(lng)) return null;
                  return (
                    <Marker
                      key={b.id}
                      position={{ lat, lng }}
                      onClick={() => {
                        setSelectedBusiness(b);
                        if (mapRef.current) mapRef.current.panTo({ lat, lng });
                      }}
                    />
                  );
                })}

                {selectedBusiness && !isNaN(parseFloat(selectedBusiness.latitude)) && (
                  <InfoWindow
                    position={{ lat: parseFloat(selectedBusiness.latitude), lng: parseFloat(selectedBusiness.longitude) }}
                    onCloseClick={() => setSelectedBusiness(null)}
                  >
                    <div style={{ maxWidth: 240 }}>
                      <div className="font-semibold text-slate-800">{selectedBusiness.name}</div>
                      <div className="text-xs text-slate-600 mt-1">{selectedBusiness.category_name}</div>
                      <div className="text-xs text-slate-500 mt-2">{selectedBusiness.address}</div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
