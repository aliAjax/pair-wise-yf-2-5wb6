import { useEffect } from 'react';
import { useBenchStore } from '@/store/useBenchStore';
import FilterBar from '@/components/FilterBar/FilterBar';
import BenchCard from '@/components/BenchCard/BenchCard';
import { Armchair, Bookmark, List, Check } from 'lucide-react';

export default function ListPage() {
  const { benches, getFilteredBenches, initialize, initialized, viewMode, setViewMode } = useBenchStore();
  const filteredBenches = getFilteredBenches();
  const pendingCount = benches.filter((bench) => bench.visitStatus === 'pending').length;

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  const isPendingEmpty = viewMode === 'pending' && pendingCount === 0;
  const emptyTitle = benches.length === 0
    ? '还没有长椅档案'
    : isPendingEmpty
      ? '还没有待探访的长椅'
      : '没有找到匹配的长椅';
  const emptyDescription = benches.length === 0
    ? '点击右上角的添加按钮，记录第一张长椅档案吧'
    : isPendingEmpty
      ? '在长椅卡片或详情页点击书签，把想坐的椅子加入清单'
      : '试试调整筛选条件或搜索关键词';

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

      <div className="inline-flex p-1 bg-warm-beige/70 rounded-lg mb-4">
        <button
          onClick={() => setViewMode('all')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === 'all'
              ? 'bg-white text-deep-brown shadow-sm'
              : 'text-ink-light hover:text-deep-brown'
          }`}
        >
          <List className="w-4 h-4" />
          全部
        </button>
        <button
          onClick={() => setViewMode('pending')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === 'pending'
              ? 'bg-white text-deep-brown shadow-sm'
              : 'text-ink-light hover:text-deep-brown'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          待探访
          {pendingCount > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              viewMode === 'pending' ? 'bg-ochre/15 text-ochre' : 'bg-deep-brown/10 text-ink-light'
            }`}>
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      <FilterBar />

      {filteredBenches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBenches.map((bench, index) => (
            <BenchCard key={bench.id} bench={bench} index={index} />
          ))}
        </div>
      ) : (
        <div className="paper-texture rounded-xl shadow-paper p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-moss-green/10 flex items-center justify-center mx-auto mb-4">
            {isPendingEmpty ? (
              <Bookmark className="w-8 h-8 text-moss-green/50" />
            ) : benches.length === 0 ? (
              <Armchair className="w-8 h-8 text-moss-green/50" />
            ) : (
              <Check className="w-8 h-8 text-moss-green/50" />
            )}
          </div>
          <h3 className="font-serif text-lg font-medium text-deep-brown mb-2">
            {emptyTitle}
          </h3>
          <p className="text-ink-light text-sm">
            {emptyDescription}
          </p>
        </div>
      )}
    </div>
  );
}
