import { useEffect } from 'react';
import { useBenchStore } from '@/store/useBenchStore';
import FilterBar from '@/components/FilterBar/FilterBar';
import BenchCard from '@/components/BenchCard/BenchCard';
import { Armchair, Bookmark } from 'lucide-react';

export default function ListPage() {
  const { benches, listTab, setListTab, getFilteredBenches, initialize, initialized } = useBenchStore();
  const filteredBenches = getFilteredBenches();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  const wantCount = benches.filter((bench) => bench.visitStatus === 'want').length;

  // 待探访清单按标记时间从近到远排
  const visibleBenches =
    listTab === 'want'
      ? filteredBenches
          .filter((bench) => bench.visitStatus === 'want')
          .sort((a, b) => (b.wantMarkedAt ?? '').localeCompare(a.wantMarkedAt ?? ''))
      : filteredBenches;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold text-deep-brown mb-1">
          长椅档案
        </h2>
        <p className="text-ink-light text-sm">
          记录城市中那些被忽略的休憩角落
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setListTab('all')}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            listTab === 'all'
              ? 'bg-moss-green text-white shadow-sm'
              : 'bg-white/60 text-ink-light hover:text-deep-brown'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setListTab('want')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm transition-colors ${
            listTab === 'want'
              ? 'bg-moss-green text-white shadow-sm'
              : 'bg-white/60 text-ink-light hover:text-deep-brown'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${listTab === 'want' ? 'fill-current' : ''}`} />
          待探访
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            listTab === 'want' ? 'bg-white/25' : 'bg-deep-brown/5'
          }`}>
            {wantCount}
          </span>
        </button>
      </div>

      <FilterBar />

      {visibleBenches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleBenches.map((bench, index) => (
            <BenchCard key={bench.id} bench={bench} index={index} />
          ))}
        </div>
      ) : (
        <div className="paper-texture rounded-xl shadow-paper p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-moss-green/10 flex items-center justify-center mx-auto mb-4">
            {listTab === 'want' ? (
              <Bookmark className="w-8 h-8 text-moss-green/50" />
            ) : (
              <Armchair className="w-8 h-8 text-moss-green/50" />
            )}
          </div>
          <h3 className="font-serif text-lg font-medium text-deep-brown mb-2">
            {listTab === 'want'
              ? '还没有待探访的长椅'
              : benches.length === 0
                ? '还没有长椅档案'
                : '没有找到匹配的长椅'}
          </h3>
          <p className="text-ink-light text-sm">
            {listTab === 'want'
              ? '在卡片或详情页点击书签，把想去的长椅标成待探访'
              : benches.length === 0
                ? '点击右上角的添加按钮，记录第一张长椅档案吧'
                : '试试调整筛选条件或搜索关键词'}
          </p>
        </div>
      )}
    </div>
  );
}
