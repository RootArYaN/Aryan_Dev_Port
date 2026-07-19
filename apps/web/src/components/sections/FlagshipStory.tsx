import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Database,
  Gauge,
  GitMerge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { manufacturingStory, type StoryChapter } from "@/data/caseStory";
import { trackEvent } from "@/lib/analytics";

const flowLabels = ["Sources", "Reconcile", "Model", "Service", "Interface", "Decision"];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function createChart(values: number[]) {
  const width = 620;
  const height = 220;
  const paddingX = 20;
  const paddingY = 22;
  const min = Math.min(...values) - 6;
  const max = Math.max(...values) + 6;
  const range = Math.max(max - min, 1);
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const points = values.map((value, index) => ({
    x: paddingX + (index / Math.max(values.length - 1, 1)) * usableWidth,
    y: paddingY + (1 - (value - min) / range) * usableHeight,
  }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = `${path} L${points.at(-1)?.x ?? width},${height} L${points[0]?.x ?? 0},${height} Z`;
  return { width, height, points, path, area };
}

function StoryVisual({ chapter, compact = false }: { chapter: StoryChapter; compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [improved, setImproved] = useState(chapter.id === "outcome");
  const trend = improved
    ? chapter.visual.trend.map((value, index) => Math.min(98, value + Math.max(2, Math.round(index / 3))))
    : chapter.visual.trend;
  const chart = useMemo(() => createChart(trend), [trend]);

  useEffect(() => {
    setImproved(chapter.id === "outcome");
  }, [chapter.id]);

  const setScenario = (next: boolean) => {
    setImproved(next);
    trackEvent("scenario_interaction", {
      surface: compact ? "flagship-stacked" : "flagship-sticky",
      slug: manufacturingStory.slug,
      scenario: next ? "improved" : "current",
    });
  };

  return (
    <div className="flagship-visual" data-testid="flagship-visual" aria-label={`${chapter.title} visualization`}>
      <div className="flagship-visual__topline">
        <span><i /> {manufacturingStory.label}</span>
        <span className="flagship-visual__status"><ShieldCheck size={13} /> checked</span>
      </div>

      <div className="flagship-visual__heading">
        <div>
          <span>{chapter.eyebrow}</span>
          <strong>{chapter.visual.status}</strong>
        </div>
        <div className="flagship-scenario" role="group" aria-label="Compare current and improved scenario">
          <button type="button" aria-pressed={!improved} onClick={() => setScenario(false)}>Current</button>
          <button type="button" data-testid="flagship-scenario" aria-pressed={improved} onClick={() => setScenario(true)}>Improved</button>
        </div>
      </div>

      <div className="flagship-visual__metrics" aria-live="polite">
        <div>
          <span>{chapter.metric.label}</span>
          <strong>{chapter.metric.value}</strong>
          <small>{improved ? "Improved sample" : "Current sample"}</small>
        </div>
        <div>
          <span>Data</span>
          <strong>{chapter.visual.flowStage >= 2 ? "Checked" : "Separate"}</strong>
          <small>{chapter.visual.flowStage >= 4 ? "Ready" : "Checks running"}</small>
        </div>
        <div>
          <span>Final control</span>
          <strong>Human</strong>
          <small>Key actions need review</small>
        </div>
      </div>

      <div className="flagship-visual__grid">
        <div className="flagship-chart">
          <div className="flagship-card-label"><Gauge size={14} /> Data quality by step</div>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label={`${chapter.metric.label} representative trend`}>
            <defs>
              <linearGradient id={`flagship-area-${chapter.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(126 231 226)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="rgb(126 231 226)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="flagship-chart__gridline" d="M20 55 H600 M20 110 H600 M20 165 H600" />
            <motion.path
              d={chart.area}
              fill={`url(#flagship-area-${chapter.id})`}
              animate={{ d: chart.area, opacity: 1 }}
              initial={reduceMotion ? false : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.42 }}
            />
            <motion.path
              d={chart.path}
              fill="none"
              stroke="rgb(134 239 232)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ d: chart.path, pathLength: 1 }}
              initial={reduceMotion ? false : { pathLength: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.56, ease: [0.22, 1, 0.36, 1] }}
            />
            {chart.points.map((point, index) => (
              <motion.circle
                key={`${chapter.id}-${index}`}
                cx={point.x}
                cy={point.y}
                r={index === chart.points.length - 1 ? 4.5 : 3}
                fill="rgb(207 250 254)"
                animate={{ cx: point.x, cy: point.y, opacity: index === chart.points.length - 1 ? 1 : 0.42 }}
                transition={{ duration: reduceMotion ? 0 : 0.42 }}
              />
            ))}
          </svg>
        </div>

        <div className="flagship-distribution">
          <div className="flagship-card-label"><Database size={14} /> Check score</div>
          <div className="flagship-distribution__bars">
            {chapter.visual.distribution.map((value, index) => {
              const adjustedValue = improved ? Math.min(98, value + 5) : value;
              return (
                <div key={flowLabels[index]}>
                  <span><small>{flowLabels[index]}</small><b>{adjustedValue}%</b></span>
                  <i><motion.b animate={{ width: `${adjustedValue}%` }} transition={{ duration: reduceMotion ? 0 : 0.45 }} /></i>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flagship-flow" aria-label="Validated data flow">
        {flowLabels.map((label, index) => {
          const active = index <= chapter.visual.flowStage;
          return (
            <div key={label} className={active ? "is-active" : undefined}>
              <span>{active ? <CheckCircle2 size={12} /> : index + 1}</span>
              <small>{label}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StoryChapterCard({ chapter, index, active, onActivate }: {
  chapter: StoryChapter;
  index: number;
  active: boolean;
  onActivate: (index: number) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onActivate(index);
      },
      { rootMargin: "-35% 0px -44% 0px", threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [index, onActivate]);

  return (
    <article
      ref={ref}
      id={`flagship-${chapter.id}`}
      className={`flagship-chapter adaptive-surface ${active ? "is-active" : ""}`}
      data-chapter={chapter.id}
      tabIndex={0}
      onFocus={() => onActivate(index)}
    >
      <div className="flagship-chapter__number">0{index + 1}</div>
      <p className="flagship-chapter__eyebrow">{chapter.eyebrow}</p>
      <h3>{chapter.title}</h3>
      <p className="flagship-chapter__summary">{chapter.summary}</p>
      <ul>
        {chapter.evidence.map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}
      </ul>
      <div className="flagship-chapter__metric">
        <strong>{chapter.metric.value}</strong>
        <span>{chapter.metric.label}</span>
        <small>{chapter.metric.detail}</small>
      </div>
      {index < manufacturingStory.chapters.length - 1 ? (
        <a href={`#flagship-${manufacturingStory.chapters[index + 1].id}`} className="flagship-chapter__prompt">
          {chapter.prompt} <ArrowDown size={14} />
        </a>
      ) : (
        <Link to={`/work/${manufacturingStory.slug}`} state={{ source: "homepage-flagship-chapter" }} className="flagship-chapter__prompt">
          {chapter.prompt} <ArrowRight size={14} />
        </Link>
      )}
    </article>
  );
}

export function FlagshipStory() {
  const reduceMotion = useReducedMotion();
  const narrowLayout = useMediaQuery("(max-width: 1023px)");
  const stacked = Boolean(reduceMotion || narrowLayout);
  const [activeIndex, setActiveIndex] = useState(0);
  const started = useRef(false);
  const completed = useRef(false);
  const activeChapter = manufacturingStory.chapters[activeIndex];

  const activateChapter = useCallback((index: number) => {
    setActiveIndex(index);
    if (!started.current) {
      started.current = true;
      trackEvent("flagship_story_started", { chapter: manufacturingStory.chapters[index].id });
    }
    if (index === manufacturingStory.chapters.length - 1 && !completed.current) {
      completed.current = true;
      trackEvent("flagship_story_completed", { chapter: manufacturingStory.chapters[index].id });
    }
  }, []);

  return (
    <section id="flagship-story" className="flagship-story px-5 py-16 lg:px-8 lg:py-20" aria-labelledby="flagship-story-title">
      <div className="mx-auto max-w-7xl">
        <div className="flagship-story__intro">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/75">Main case</p>
            <h2 id="flagship-story-title" className="mt-5 max-w-4xl text-balance text-4xl font-medium leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">
              How one slow report became a fast, trusted tool.
            </h2>
          </div>
          <div className="flagship-story__intro-copy">
            <p>See the problem, the build, the checks, and the result.</p>
            <span><Sparkles size={14} /> Private data is not shown</span>
          </div>
        </div>

        <div className={`flagship-story__layout ${stacked ? "is-stacked" : ""}`} data-layout={stacked ? "stacked" : "sticky"}>
          <div className="flagship-story__chapters">
            {manufacturingStory.chapters.map((chapter, index) => (
              <div key={chapter.id}>
                <StoryChapterCard chapter={chapter} index={index} active={activeIndex === index} onActivate={activateChapter} />
                {stacked && <StoryVisual chapter={chapter} compact />}
              </div>
            ))}
          </div>

          {!stacked && (
            <div className="flagship-story__sticky" data-testid="flagship-sticky">
              <div className="flagship-story__progress" aria-label="Flagship story chapters">
                <div className="flagship-story__progress-track"><motion.i animate={{ scaleX: (activeIndex + 1) / manufacturingStory.chapters.length }} /></div>
                {manufacturingStory.chapters.map((chapter, index) => (
                  <a key={chapter.id} href={`#flagship-${chapter.id}`} aria-current={activeIndex === index ? "step" : undefined} onClick={() => activateChapter(index)}>
                    <span>0{index + 1}</span>{chapter.id}
                  </a>
                ))}
              </div>
              <StoryVisual chapter={activeChapter} />
            </div>
          )}
        </div>

        <div className="flagship-story__footer">
          <div><GitMerge size={18} /><span>{manufacturingStory.disclosure}</span></div>
          <Link
            to={`/work/${manufacturingStory.slug}`}
            state={{ source: "homepage-flagship" }}
            className="flagship-story__case-link"
          >
            Read the full case <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
