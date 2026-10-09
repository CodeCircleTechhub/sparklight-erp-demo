import { useCallback, useEffect, useState } from 'react';
import { Users, Search, Loader2, AlertCircle, X, Eye, Contact } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const ageOf = (dob?: string | null) => {
  if (!dob) return '—';
  const years = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return years >= 0 ? `${years} yrs` : '—';
};

type FamilyCard = {
  cardNumber: string;
  familyName: string;
  headName: string;
  members: number;
  registeredAt: string;
};

type FamilyMember = {
  _id: string;
  patientId: string;
  name: string;
  relationship: string;
  gender: string;
  dob: string | null;
  phone: string;
  email: string;
  status: string;
  registeredAt: string;
};

export default function FamilyCards() {
  const [cards, setCards] = useState<FamilyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<FamilyCard | null>(null);
  const [detail, setDetail] = useState<{
    head: { _id: string; patientId: string; name: string };
    familyName: string;
    members: FamilyMember[];
  } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const load = useCallback(async (q = '') => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/family/cards', { params: q ? { search: q } : {} });
      setCards(data.cards || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load family cards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSearch = (q: string) => {
    setSearch(q);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(search.trim());
  };

  const openCard = async (card: FamilyCard) => {
    setOpen(card);
    setDetail(null);
    setDetailError('');
    setDetailLoading(true);
    try {
      const { data } = await api.get(`/family/cards/${card.cardNumber}`);
      setDetail(data);
    } catch (err: any) {
      setDetailError(err.response?.data?.message || 'Failed to load this family card');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Family Cards" icon={Contact} />

        <form onSubmit={submitSearch} className="mb-6 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by card number, family name or member..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading family cards...
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Card Number', 'Family Name', 'Head of Family', 'Members', 'Registered', ''].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cards.map((c) => (
                    <tr key={c.cardNumber} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{c.cardNumber}</td>
                      <td className="px-5 py-4 text-sm text-gray-900">{c.familyName}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{c.headName}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{c.members}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{fmtDate(c.registeredAt)}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => openCard(c)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cards.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                        No family cards found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(null)}>
          <div
            className="bg-white rounded-xl w-full max-w-3xl shadow-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600 shrink-0" />
                  {detail?.familyName || open.familyName || 'Family Card'}{' '}
                  <span className="text-sm font-medium text-blue-600">{open.cardNumber}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Head of family: {detail?.head?.name || open.headName} · {detail?.members?.length || open.members} member(s)
                </p>
              </div>
              <button onClick={() => setOpen(null)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-x-auto">
              {detailLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading members...
                </div>
              ) : detailError ? (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {detailError}
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      {['Name', 'Relationship', 'Patient ID', 'Gender', 'Age', 'Phone', 'Email', 'Status'].map((h) => (
                        <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(detail?.members || []).map((m) => (
                      <tr key={m._id} className="hover:bg-gray-50 text-sm">
                        <td className="px-3 py-2.5 font-medium text-gray-900">{m.name}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              m.relationship === 'Head of family'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {m.relationship}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-gray-600">{m.patientId}</td>
                        <td className="px-3 py-2.5 text-gray-600">{m.gender || '—'}</td>
                        <td className="px-3 py-2.5 text-gray-600">{ageOf(m.dob)}</td>
                        <td className="px-3 py-2.5 text-gray-600">{m.phone || '—'}</td>
                        <td className="px-3 py-2.5 text-gray-600">{m.email || '—'}</td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
