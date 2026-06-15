'use client';

const MOCK_ACTIVITY = [
  { id: '1', icon: '🎓', color: 'bg-brand-500/15',  action: 'Account created',        detail: 'Welcome to Stackora!',              time: 'Just now' },
  { id: '2', icon: '🛡️', color: 'bg-teal-500/15',  action: 'Academy unlocked',        detail: 'Explore 200+ security courses',    time: '2m ago'   },
  { id: '3', icon: '💳', color: 'bg-yellow-500/15', action: 'Wallet activated',        detail: 'Fund your wallet to get started',  time: '5m ago'   },
  { id: '4', icon: '👥', color: 'bg-emerald-500/15', action: 'Community joined',       detail: 'Connect with 50k+ members',        time: '10m ago'  },
  { id: '5', icon: '🔗', color: 'bg-purple-500/15', action: 'Tools Hub ready',         detail: 'Create your bio link page',        time: '15m ago'  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-navy-800 border border-white/8 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-bold text-white">Recent Activity</h3>
        <span className="text-xs text-slate-500 hover:text-brand-400 cursor-pointer transition-colors">View all</span>
      </div>

      <div className="space-y-1">
        {MOCK_ACTIVITY.map((item, i) => (
          <div key={item.id} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
            <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-sm flex-shrink-0 mt-0.5`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{item.action}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
            </div>
            <span className="text-[11px] text-slate-600 flex-shrink-0 mt-1">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
