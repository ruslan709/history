import { useEffect, useMemo, useRef, useState } from 'react'
import type { Content, Grade } from '../types'
import { ROMAN } from '../types'
import { loadPublic } from '../github'
import { computeStats, pluralChapters } from '../utils'

function Illustration() {
  return (
    <div className="illustration">
      <svg viewBox="0 0 320 230" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="float-slow">
          <rect x="118" y="18" width="150" height="108" rx="10" transform="rotate(8 118 18)" fill="#F1E4C4" stroke="#C9A15A" strokeWidth="2" />
          <path d="M140 40 Q170 55 160 80 T190 100" stroke="#7C2540" strokeWidth="1.6" fill="none" strokeDasharray="4 3" transform="rotate(8 118 18)" />
          <circle cx="150" cy="45" r="3" fill="#7C2540" transform="rotate(8 118 18)" />
          <circle cx="195" cy="98" r="3" fill="#7C2540" transform="rotate(8 118 18)" />
        </g>
        <g className="float-slow d2">
          <path d="M40 150 C40 145 44 141 49 141 H108 V196 H49 C44 196 40 192 40 187 Z" fill="#182848" />
          <path d="M176 150 C176 145 172 141 167 141 H108 V196 H167 C172 196 176 192 176 187 Z" fill="#233a63" />
          <path d="M108 141 V196" stroke="#E7CE9B" strokeWidth="1.4" />
          <line x1="52" y1="153" x2="98" y2="153" stroke="#8aa0c9" strokeWidth="1.4" />
          <line x1="52" y1="163" x2="98" y2="163" stroke="#8aa0c9" strokeWidth="1.4" />
          <line x1="52" y1="173" x2="92" y2="173" stroke="#8aa0c9" strokeWidth="1.4" />
        </g>
        <g>
          <rect x="182" y="120" width="86" height="52" rx="8" fill="#FBF6E9" stroke="#C9A15A" strokeWidth="2" />
          <circle cx="182" cy="146" r="9" fill="#F1E4C4" stroke="#C9A15A" strokeWidth="2" />
          <circle cx="268" cy="146" r="9" fill="#F1E4C4" stroke="#C9A15A" strokeWidth="2" />
          <line x1="198" y1="134" x2="252" y2="134" stroke="#B79A6E" strokeWidth="1.4" />
          <line x1="198" y1="144" x2="252" y2="144" stroke="#B79A6E" strokeWidth="1.4" />
          <line x1="198" y1="154" x2="238" y2="154" stroke="#B79A6E" strokeWidth="1.4" />
        </g>
        <g>
          <circle cx="227" cy="96" r="30" fill="#fff" stroke="#182848" strokeWidth="2.5" />
          <circle cx="227" cy="96" r="23" fill="none" stroke="#C9A15A" strokeWidth="1.2" />
          <g className="compass-needle">
            <path d="M227 78 L233 96 L227 114 L221 96 Z" fill="#7C2540" />
          </g>
          <circle cx="227" cy="96" r="3" fill="#182848" />
        </g>
      </svg>
    </div>
  )
}

const CHANNEL_INVITE = 'https://max.ru/join/wtqCgXNPK5OO-lElEe81Z6RUJyLdZQ08YeVDu380Hfs'

// Логотип канала: пробуем logo.png → logo.webp → logo.jpg, иначе рисованная эмблема.
const LOGO_CANDIDATES = ['logo.png', 'logo.webp', 'logo.jpg']
function BrandEmblem() {
  const [i, setI] = useState(0)
  if (i >= LOGO_CANDIDATES.length) return <Illustration />
  return (
    <div className="illustration">
      <img
        className="brand-logo"
        src={`${import.meta.env.BASE_URL}${LOGO_CANDIDATES[i]}`}
        alt="История для урока и жизни"
        onError={() => setI((n) => n + 1)}
      />
    </div>
  )
}

// Иконка канала MAX: пробуем max.png → max.webp → max.jpeg → max.jpg, иначе SVG-значок.
const MAX_CANDIDATES = ['max.png', 'max.webp', 'max.jpeg', 'max.jpg']
function MaxIcon() {
  const [i, setI] = useState(0)
  if (i < MAX_CANDIDATES.length)
    return <img className="max-logo" src={`${import.meta.env.BASE_URL}${MAX_CANDIDATES[i]}`} alt="MAX" onError={() => setI((n) => n + 1)} />
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MAX">
      <defs>
        <linearGradient id="mx" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor="#2f7bff" />
          <stop offset="1" stopColor="#7a5cff" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#mx)" />
      <path d="M14 32V17l6 8 6-8v15" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 17l7 15M37 17l-7 15" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Тонкие SVG-иконки для карточек статистики
const IconBook = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
    <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5z" />
  </svg>
)
const IconLayers = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="M3 13l9 5 9-5" /><path d="M3 18l9 5 9-5" />
  </svg>
)
const IconCap = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 9 12 4 2 9l10 5 10-5Z" /><path d="M6 11v5c0 1 2.7 3 6 3s6-2 6-3v-5" />
  </svg>
)

function StatNum({ target }: { target: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef(target)
  ref.current = target
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const dur = 900
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(ref.current * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return <>{val}</>
}

function highlight(text: string, q: string) {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q)
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <span className="lesson-mark">{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  )
}

export default function Nav() {
  const [content, setContent] = useState<Content | null>(null)
  const [error, setError] = useState('')
  const [gradeId, setGradeId] = useState<string>('')
  const [openSection, setOpenSection] = useState<string>('')
  const [query, setQuery] = useState('')
  const [showJoin, setShowJoin] = useState(false)

  function closeJoin() {
    setShowJoin(false)
    localStorage.setItem('istoriya_join_seen', '1')
  }

  useEffect(() => {
    loadPublic()
      .then((c) => {
        setContent(c)
        // Восстанавливаем последний выбранный класс и открытую главу
        const savedGrade = localStorage.getItem('istoriya_nav_grade')
        const savedSection = localStorage.getItem('istoriya_nav_section')
        const g = c.grades.find((x) => x.id === savedGrade) ?? c.grades[0]
        if (g) {
          setGradeId(g.id)
          const sec = g.sections.find((s) => s.id === savedSection) ?? g.sections[0]
          setOpenSection(sec?.id ?? '')
        }
        // Окно с приглашением подписаться — один раз на устройство
        if (!localStorage.getItem('istoriya_join_seen')) setShowJoin(true)
        // Возврат к последней открытой теме — чтобы смотреть соседние темы подряд
        const savedTopic = localStorage.getItem('istoriya_nav_topic')
        if (savedTopic) {
          setTimeout(() => {
            const el = document.getElementById('t-' + savedTopic)
            if (el) {
              el.scrollIntoView({ block: 'center' })
              el.classList.add('lesson-just')
              setTimeout(() => el.classList.remove('lesson-just'), 1600)
            }
          }, 350)
        }
      })
      .catch((e) => setError(String(e.message || e)))
  }, [])

  const stats = useMemo(() => (content ? computeStats(content) : null), [content])
  const grade: Grade | undefined = content?.grades.find((g) => g.id === gradeId)
  const q = query.trim().toLowerCase()

  function selectGrade(g: Grade) {
    const first = g.sections[0]?.id ?? ''
    setGradeId(g.id)
    setOpenSection(first)
    setQuery('')
    localStorage.setItem('istoriya_nav_grade', g.id)
    localStorage.setItem('istoriya_nav_section', first)
  }

  function toggleSection(id: string) {
    setOpenSection((cur) => {
      const next = cur === id ? '' : id
      localStorage.setItem('istoriya_nav_section', next)
      return next
    })
  }

  if (error) {
    return (
      <div className="shell">
        <div className="content-card">
          <div className="empty-state">
            <div className="big">⚠️</div>
            <div>{error}</div>
          </div>
        </div>
      </div>
    )
  }
  if (!content || !grade || !stats) {
    return (
      <div className="shell">
        <div className="content-card">
          <div className="empty-state"><div className="big">📚</div>Загрузка материалов…</div>
        </div>
      </div>
    )
  }

  const anyMatch =
    !q || grade.sections.some((s) => s.topics.some((t) => t.title.toLowerCase().includes(q)))

  let lastCourse = ' '

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <div className="brand-eyebrow">✦ Электронное пособие нового поколения</div>
          <h1>📚 История <span className="accent">на пальцах</span></h1>
          <div className="tagline">История для урока и жизни</div>
          <p className="lead">
            Современные материалы по истории для учителей, родителей и школьников — от 5 до 11 класса,
            собранные в одну понятную навигацию.
          </p>
          <div className="search-wrap">
            <span className="icon">🔍</span>
            <input
              type="text"
              placeholder="Найти тему, например «Древние»…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="search-hint">Поиск идёт по параграфам открытого класса и подсвечивает совпадения</div>
        </div>
        <BrandEmblem />
      </header>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-icon"><IconBook /></div>
          <div><div className="stat-num"><StatNum target={stats.topics} /></div><div className="stat-label">Материалов</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><IconLayers /></div>
          <div><div className="stat-num"><StatNum target={stats.sections} /></div><div className="stat-label">Глав</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><IconCap /></div>
          <div><div className="stat-num"><StatNum target={stats.grades} /></div><div className="stat-label">Классов</div></div>
        </div>
      </section>

      <a className="join-cta" href={CHANNEL_INVITE} target="_blank" rel="noopener noreferrer">
        <span className="jc-glow" aria-hidden="true"></span>
        <span className="jc-badge"><MaxIcon /></span>
        <span className="jc-body">
          <span className="jc-title">Все материалы — в нашем канале MAX</span>
          <span className="jc-sub">Подпишитесь, чтобы открывать темы из навигатора. Бесплатно и в один тап.</span>
        </span>
        <span className="jc-btn">Подписаться на канал →</span>
      </a>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-title">🎓 Классы</div>
          <div className="class-list">
            {content.grades.map((g) => (
              <button
                key={g.id}
                className={'class-btn' + (g.id === gradeId ? ' active' : '')}
                onClick={() => selectGrade(g)}
              >
                <span>{g.id} класс</span>
                <span className="num">{ROMAN[g.id] ?? ''}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="content-card">
          <div className="content-head">
            <div>
              <div className="eyebrow">{grade.id} класс</div>
              <h2>{grade.title}</h2>
              <div className="sub">{grade.subtitle}</div>
            </div>
            <div className="chapter-count-pill">
              {grade.sections.length} {pluralChapters(grade.sections.length)}
            </div>
          </div>

          {!anyMatch ? (
            <div className="empty-state">
              <div className="big">🔍</div>
              <div>По запросу «{query}» ничего не найдено в {grade.id} классе</div>
            </div>
          ) : (
            grade.sections.map((sec) => {
              const itemsMatch = sec.topics.map((t) => ({ ...t, matches: !q || t.title.toLowerCase().includes(q) }))
              const chapterHasMatch = !q || itemsMatch.some((t) => t.matches)
              const forceOpen = !!q && chapterHasMatch
              const isOpen = openSection === sec.id
              const showCourseHeading = sec.course && sec.course !== lastCourse
              if (sec.course) lastCourse = sec.course

              return (
                <div key={sec.id}>
                  {showCourseHeading && <div className="course-heading">📘 {sec.course}</div>}
                  <div className={'chapter' + (isOpen || forceOpen ? ' open' : '') + (q && !chapterHasMatch ? ' dim-all' : '')}>
                    <div className="chapter-head" onClick={() => toggleSection(sec.id)}>
                      <div className="chapter-roman">{sec.roman}</div>
                      <div className="chapter-titles">
                        <div className="ctitle">📜 Глава {sec.roman}. {sec.name}</div>
                        <div className="cmeta">{sec.topics.length} материалов</div>
                      </div>
                      <div className="chapter-toggle">▼</div>
                    </div>
                    <div className="chapter-body" style={{ maxHeight: isOpen || forceOpen ? '2000px' : '0' }}>
                      <div className="chapter-body-inner">
                        {sec.topics.length === 0 && (
                          <div className="lesson"><div className="lesson-title" style={{ color: 'var(--text-muted)' }}>Материалы скоро появятся</div></div>
                        )}
                        {itemsMatch.map((t) => {
                          const clickable = !!t.url
                          const cls = 'lesson' + (clickable ? ' clickable' : '') + (q && !t.matches ? ' dim' : '')
                          const inner = (
                            <>
                              <div className="lesson-icon">{t.icon}</div>
                              <div className="lesson-title">{highlight(t.title, q)}</div>
                              {clickable ? <span className="lesson-arrow">↗</span> : <span className="lesson-soon">скоро</span>}
                            </>
                          )
                          return clickable ? (
                            <a
                              key={t.id}
                              id={`t-${t.id}`}
                              className={cls}
                              href={t.url}
                              onClick={() => localStorage.setItem('istoriya_nav_topic', t.id)}
                            >{inner}</a>
                          ) : (
                            <div key={t.id} className={cls}>{inner}</div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </section>
      </div>

      <footer className="nav-footer">
        <span className="fmark">©</span> История на пальцах — навигация по школьной программе.
      </footer>

      {showJoin && (
        <div className="jm-overlay" onClick={closeJoin}>
          <div className="jm-card" onClick={(e) => e.stopPropagation()}>
            <button className="jm-close" onClick={closeJoin} aria-label="Закрыть">×</button>
            <div className="jm-badge"><MaxIcon /></div>
            <h3 className="jm-title">Подпишитесь на канал MAX</h3>
            <p className="jm-sub">Все материалы — в нашем канале. Это бесплатно и в один тап. После подписки открываются все темы навигатора.</p>
            <a className="jm-btn" href={CHANNEL_INVITE} target="_blank" rel="noopener noreferrer" onClick={closeJoin}>
              Подписаться на канал →
            </a>
            <button className="jm-later" onClick={closeJoin}>Уже подписан(а) · закрыть</button>
          </div>
        </div>
      )}
    </div>
  )
}
