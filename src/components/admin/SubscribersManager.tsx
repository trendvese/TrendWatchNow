import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { 
  getAllSubscribers, 
  deleteSubscriber, 
  unsubscribe,
  exportSubscribersCSV,
  Subscriber 
} from '@/services/subscriberService';

interface SubscribersManagerProps {
  onBack: () => void;
}

export function SubscribersManager({ onBack }: SubscribersManagerProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    setLoading(true);
    const data = await getAllSubscribers();
    setSubscribers(data);
    setLoading(false);
  };

  const handleUnsubscribe = async (id: string) => {
    const success = await unsubscribe(id);
    if (success) {
      setSubscribers(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status: 'unsubscribed' } : sub)
      );
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteSubscriber(id);
    if (success) {
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
      setShowDeleteConfirm(null);
    }
  };

  const handleExport = () => {
    const csvContent = exportSubscribersCSV(filteredSubscribers);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteSubscriber(id);
    }
    setSubscribers(prev => prev.filter(sub => !selectedIds.includes(sub.id)));
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubscribers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubscribers.map(sub => sub.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredSubscribers = subscribers
    .filter(sub => {
      if (filter === 'active') return sub.status === 'active';
      if (filter === 'unsubscribed') return sub.status === 'unsubscribed';
      return true;
    })
    .filter(sub => 
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-white/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📬</span> Newsletter Subscribers
              </h1>
              <p className="text-sm text-slate-400">Manage your email subscribers</p>
            </div>
          </div>
          
          <button
            onClick={handleExport}
            disabled={subscribers.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <span className="text-violet-400 text-lg">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-slate-400">Total Subscribers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-lg">✓</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
                <p className="text-sm text-slate-400">Active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-lg">✗</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">{stats.unsubscribed}</p>
                <p className="text-sm text-slate-400">Unsubscribed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {(['all', 'active', 'unsubscribed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                  filter === f
                    ? "bg-violet-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Selected ({selectedIds.length})
              </button>
            )}
            
            <div className="relative">
              <svg className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-slate-800/50 border border-white/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="text-4xl mb-4">📭</span>
              <p className="text-lg font-medium">No subscribers yet</p>
              <p className="text-sm">Subscribers will appear here when users sign up</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-violet-500 focus:ring-violet-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Source</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Subscribed</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-white/5 hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(subscriber.id)}
                        onChange={() => toggleSelect(subscriber.id)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-violet-500 focus:ring-violet-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                          {subscriber.email[0].toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium",
                        subscriber.status === 'active'
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      )}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {subscriber.source}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {subscriber.status === 'active' && (
                          <button
                            onClick={() => handleUnsubscribe(subscriber.id)}
                            title="Unsubscribe"
                            className="p-2 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        )}
                        
                        {showDeleteConfirm === subscriber.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(subscriber.id)}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1 bg-slate-600 text-white text-xs rounded-lg hover:bg-slate-500"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(subscriber.id)}
                            title="Delete"
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
            <span>💡</span> Tips for Email Marketing
          </h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Export subscribers to CSV and import into Mailchimp, ConvertKit, or any email service</li>
            <li>• Send weekly newsletters with your trending articles</li>
            <li>• Always include an unsubscribe link in your emails (required by law)</li>
            <li>• Segment your audience based on interests for better engagement</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
