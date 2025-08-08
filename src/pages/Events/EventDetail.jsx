import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Globe,
  Phone,
  User,
  ArrowLeft,
  Clock,
  Tag,
} from "lucide-react";
import api from "../../lib/interceptor";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/afghan/event/${id}/`);
        setEvent(res.data);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500">No Event Details</p>
      </div>
    );
  }

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC' 
    });
  } catch (e) {
    return d;
  }
};



  const initials = (name = "?") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="px-2 py-2 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="inline-flex items-center gap-3 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-full shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5"
        >
          <span className="bg-indigo-50 p-2 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
          </span>
          <span className="text-sm font-medium text-gray-700">Back to events</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-tr from-white to-gray-50 rounded-xl p-5 shadow-lg border border-gray-100">
          <div className="flex flex-col  gap-5">
            <div className="w-full flex items-center justify-center">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.name}
                  className="w-full h-48 md:h-67 object-cover rounded-lg shadow-inner"
                />
              ) : (
                <div className="w-full h-48 md:h-40 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="flex sm:flex-row justify-between">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {event.name}
              </h1>

              <div className=" flex items-center">
                <a
                  href={event.website || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:brightness-95 transition"
                >
                  <Globe className="w-4 h-4" /> Buy Tickets
                </a>

              </div>

            </div>

          </div>

        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <h3 className="text-sm text-gray-400 uppercase tracking-wide">When & Where</h3>
            <div className="mt-3 space-y-3 text-gray-700">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <div>
                  <div className="text-sm font-medium">Date & time</div>
                  <div className="text-xs text-gray-500">{formatDate(event.date)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Venue</div>
                  <div className="text-xs text-gray-500">{event.venue || event.address || "N/A"}</div>
                </div>
              </div>

              {event.capacity && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-sky-600" />
                  <div>
                    <div className="text-sm font-medium">Capacity</div>
                    <div className="text-xs text-gray-500">{event.capacity}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2 flex-wrap">
              {(event.category || "").length > 0 && (
                <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">{event.category}</span>
              )}
              {event.status && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">{event.status}</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <h3 className="text-sm text-gray-400 uppercase tracking-wide">Organizer</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-50 flex items-center justify-center text-indigo-700 font-bold">
                {initials(event.contact_name || event.organizer)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{event.contact_name || event.organizer || "Unknown"}</div>
                <div className="text-xs text-gray-500">{event.contact_info || "No contact info"}</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {event.contact_info && (
                <a
                  href={`tel:${event.contact_info}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:shadow-sm transition"
                >
                  <Phone className="w-4 h-4 text-orange-500" /> Call
                </a>
              )}
              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white hover:brightness-95 transition"
                >
                  <Globe className="w-4 h-4" /> Website
                </a>
              )}
            </div>
          </div>

        </aside>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
          <h4 className="text-sm text-gray-400 uppercase tracking-wide">Full description</h4>
          <p className="mt-3 text-gray-700 leading-relaxed">{event.long_description || event.description}</p>
        </div>
      </div>
    </div>
  );
}
