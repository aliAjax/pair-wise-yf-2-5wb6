import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Volume2, Sun, Armchair, Bookmark, BookmarkCheck, Check } from 'lucide-react';
import type { Bench } from '@/types';
import { MATERIAL_LABELS, SHADE_LABELS, NOISE_LABELS, STAY_DURATION_LABELS } from '@/types';
import Rating from '@/components/Rating/Rating';
import { calculateComfortScore, getComfortLevel, getComfortColor } from '@/utils/comfort';
import { useBenchStore } from '@/store/useBenchStore';

interface BenchCardProps {
  bench: Bench;
  index?: number;
}

export default function BenchCard({ bench, index = 0 }: BenchCardProps) {
  const navigate = useNavigate();
  const togglePendingVisit = useBenchStore((state) => state.togglePendingVisit);
  const markVisited = useBenchStore((state) => state.markVisited);
  const comfortScore = calculateComfortScore(bench);
  const comfortLevel = getComfortLevel(comfortScore);
  const comfortColor = getComfortColor(comfortScore);

  const isPending = bench.visitStatus === 'pending';
  const isVisited = bench.visitStatus === 'visited';

  const staggerClass = `stagger-${(index % 6) + 1}`;

  return (
    <div
      onClick={() => navigate(`/bench/${bench.id}`)}
      className={`paper-texture rounded-xl shadow-card card-hover cursor-pointer overflow-hidden fade-in opacity-0 ${staggerClass}`}
    >
      <div className="h-36 bg-gradient-to-br from-warm-cream to-warm-beige relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-moss-green/10 flex items-center justify-center">
            <Armchair className="w-10 h-10 text-moss-green/50" />
          </div>
        </div>

        <div className="absolute top-3 right-3 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium">
          <span className={comfortColor}>{comfortLevel}</span>
          <span className="text-ink-light ml-1">{comfortScore}</span>
        </div>

        <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs text-ink-light">
          {MATERIAL_LABELS[bench.material]}
        </div>

        {isPending && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              markVisited(bench.id);
            }}
            title="标为已探访"
            className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/85 backdrop-blur-sm rounded-full text-xs text-moss-green hover:bg-moss-green hover:text-white transition-colors"
          >
            <Check className="w-3 h-3" />
            标为已探访
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePendingVisit(bench.id);
          }}
          title={isPending ? '取消待探访' : isVisited ? '再次标记待探访' : '标为待探访'}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            isPending
              ? 'bg-ochre text-white shadow-md'
              : isVisited
                ? 'bg-moss-green text-white shadow-md'
                : 'bg-white/80 text-ink-light hover:text-ochre'
          }`}
        >
          {isVisited ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className={`w-4 h-4 ${isPending ? 'fill-current' : ''}`} />
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-deep-brown mb-1 line-clamp-1">
          {bench.name}
        </h3>

        <div className="flex items-center gap-1 text-ink-light text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{bench.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {isPending && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-ochre/10 text-ochre text-xs rounded-md">
              <Bookmark className="w-3 h-3 fill-current" />
              待探访
            </span>
          )}
          {isVisited && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-moss-green/10 text-moss-green text-xs rounded-md">
              <BookmarkCheck className="w-3 h-3" />
              已探访
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-moss-green/10 text-moss-green text-xs rounded-md">
            <Sun className="w-3 h-3" />
            {SHADE_LABELS[bench.shadeLevel]}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-ochre/10 text-ochre text-xs rounded-md">
            <Volume2 className="w-3 h-3" />
            {NOISE_LABELS[bench.noiseLevel]}
          </span>
          {bench.hasBackrest && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-moss-green/10 text-moss-green text-xs rounded-md">
              有靠背
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Rating value={bench.rating} readOnly size="sm" />
          <div className="flex items-center gap-1 text-xs text-ink-light">
            <Clock className="w-3.5 h-3.5" />
            <span>{STAY_DURATION_LABELS[bench.stayDuration]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
