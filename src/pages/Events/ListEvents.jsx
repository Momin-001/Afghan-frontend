import React, { useEffect, useState, useMemo } from "react";
import { Calendar, MapPin, Info, Search, Filter, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/interceptor";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get("/afghan/event/");
        setEvents(res.data || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();
  const now = new Date(); 

  return events
    .filter((e) => {
      const eventDateTimeUTC = new Date(e.date); 
      const eventLocal = new Date(
        eventDateTimeUTC.getTime() + eventDateTimeUTC.getTimezoneOffset() * 60000
      );

      if (category === "past") {
        return eventLocal < now;
      }
      if (category === "upcoming") {
        return eventLocal >= now;
      }
      return true; 
    })
    .filter(
      (e) =>
        !q ||
        (e.name || "").toLowerCase().includes(q) ||
        (e.description || "").toLowerCase().includes(q)
    )
    .sort((a, b) => {
      const aLocal = new Date(new Date(a.date).getTime() + new Date(a.date).getTimezoneOffset() * 60000);
      const bLocal = new Date(new Date(b.date).getTime() + new Date(b.date).getTimezoneOffset() * 60000);
      return aLocal - bLocal;
    });
}, [events, query, category]);


  const truncate = (text, length) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch (e) {
      return d;
    }
  };

  return (
    <div className=" max-w-7xl px-4 py-4 space-y-8">
      <header className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">Discover local events, meetups and happenings nearby.</p>
        </div>

        <div className="flex flex-col items-start sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, keywords or venues"
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              aria-label="Search events"
            />
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
          </div>

          <div className="inline-flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white shadow-sm text-sm"
            >
             <option value="">All</option>
             <option value="past">Past</option>
             <option value="upcoming">Upcoming</option>

            </select>
            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100"
            >
              <Filter className="w-4 h-4 text-gray-600" /> Reset
            </button>
          </div>
        </div>
      </header>

      {/* Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <div className="w-full h-36 bg-gray-100 rounded-md" />
                <div className="mt-4 h-4 bg-gray-100 rounded w-3/4" />
                <div className="mt-2 h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <article
                key={event.id}
                onClick={() => navigate(`${event.id}`)}
                className="group bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition cursor-pointer"
                aria-label={`Open ${event.name}`}
              >
                <div className="relative">
                  {(event.image || event.image_url) ? (
                    <img
                      src={event.image || event.image_url}
                      alt={event.name}
                      className="w-full h-44 object-contain"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}

                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 text-xs bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200">
                    <Calendar className="w-3 h-3 text-blue-600" /> {formatDate(event.date)}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">{event.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{truncate(event.description, 50)}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="max-w-[10rem]">{truncate(event.venue, 23)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-blue-600 font-medium group-hover:underline">
                      <Info className="w-4 h-4" /> View
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center justify-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Go Up"
          className="inline-flex items-center gap-3 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-full shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5"
        >
          <span className="bg-indigo-50 p-2 rounded-full flex items-center justify-center">
            <ArrowUp className="w-4 h-4 text-indigo-600" />
          </span>
          <span className="text-sm font-medium text-gray-700">Back to events</span>
        </button>
        
      </div>
    </div>
  );
}
