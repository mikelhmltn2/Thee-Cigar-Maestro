'use client'

import { useEffect, useState } from 'react'
import { AnimatedReveal, GoldGradientText, LuxuryButton, LuxuryCard } from '@/components/luxury'

// Local types for state
interface EducationProgressState {
	totalLessons: number
	completedLessons: number
}

interface ProgressState {
	monthlyCount: number
	monthlyTarget: number
	newWrapperThisMonth: boolean
	education: EducationProgressState
	lastUpdated: number
}

const DEFAULT_STATE: ProgressState = {
	monthlyCount: 0,
	monthlyTarget: 10,
	newWrapperThisMonth: false,
	education: { totalLessons: 10, completedLessons: 0 },
	lastUpdated: Date.now(),
}

const STORAGE_KEY = 'progress_state_v1'

export default function ProgressPage() {
	const [state, setState] = useState<ProgressState>(DEFAULT_STATE)
	const [isReady, setIsReady] = useState(false)

	// Lazy-load storageManager on client only
	useEffect(() => {
		let isMounted = true
		;(async () => {
			try {
				const mod = await import('@/utils/storage.js')
				const storageManager = mod.default
				const saved = storageManager.getLocal(STORAGE_KEY)
				if (isMounted && saved) {
					setState(saved)
				}
			} catch (_e) {
				// no-op: keep defaults
			} finally {
				if (isMounted) setIsReady(true)
			}
		})()
		return () => {
			isMounted = false
		}
	}, [])

	const persist = async (next: ProgressState) => {
		try {
			const mod = await import('@/utils/storage.js')
			await mod.default.setLocal(STORAGE_KEY, next)
		} catch (_e) {
			// ignore
		}
	}

	const update = (partial: Partial<ProgressState>) => {
		setState(prev => {
			const next = { ...prev, ...partial, lastUpdated: Date.now() }
			persist(next)
			return next
		})
	}

	const incrementMonthly = () => update({ monthlyCount: Math.min(state.monthlyTarget, state.monthlyCount + 1) })
	const decrementMonthly = () => update({ monthlyCount: Math.max(0, state.monthlyCount - 1) })
	const setTarget = (target: number) => update({ monthlyTarget: Math.max(1, Math.min(100, target)) })
	const toggleNewWrapper = () => update({ newWrapperThisMonth: !state.newWrapperThisMonth })
	const completeLesson = () =>
		update({ education: { ...state.education, completedLessons: Math.min(state.education.totalLessons, state.education.completedLessons + 1) } })
	const resetProgress = () => update({ ...DEFAULT_STATE, lastUpdated: Date.now() })

	const monthlyProgressPct = Math.round((state.monthlyCount / Math.max(1, state.monthlyTarget)) * 100)
	const educationPct = Math.round((state.education.completedLessons / Math.max(1, state.education.totalLessons)) * 100)

	return (
		<div className="min-h-screen pt-20 bg-gradient-to-br from-background-primary via-background-secondary to-background-accent">
			<section className="section-luxury">
				<div className="container-luxury">
					<AnimatedReveal>
						<h1 className="text-luxury-heading mb-4">Your <GoldGradientText>Progress</GoldGradientText></h1>
					</AnimatedReveal>
					<AnimatedReveal delay={0.1}>
						<p className="text-luxury-body max-w-3xl">Monitor your monthly ritual goals and learning milestones. Data is stored privately in your browser.</p>
					</AnimatedReveal>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
						<LuxuryCard variant="premium" className="p-0 overflow-hidden">
							<div className="p-6">
								<h3 className="text-text-primary font-semibold mb-2">Monthly Sessions</h3>
								<p className="text-text-muted mb-4">{state.monthlyCount} / {state.monthlyTarget}</p>
								<div className="h-3 w-full bg-background-accent rounded-full overflow-hidden border border-luxury-gold/20">
									<div className="h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-dark" style={{ width: `${monthlyProgressPct}%` }} />
								</div>
								<div className="flex items-center gap-3 mt-4">
									<LuxuryButton size="sm" onClick={decrementMonthly} variant="secondary">-</LuxuryButton>
									<LuxuryButton size="sm" onClick={incrementMonthly}>+ Add</LuxuryButton>
								</div>
							</div>
							<div className="px-6 pb-6">
								<label className="block text-sm text-text-muted mb-2">Monthly Target</label>
								<input
									type="number"
									min={1}
									max={100}
									value={state.monthlyTarget}
									onChange={(e) => setTarget(parseInt(e.target.value || '1', 10))}
									className="input-luxury w-full"
								/>
							</div>
						</LuxuryCard>

						<LuxuryCard variant="premium" className="p-6">
							<h3 className="text-text-primary font-semibold mb-2">Education Progress</h3>
							<p className="text-text-muted mb-4">{state.education.completedLessons} of {state.education.totalLessons} lessons</p>
							<div className="h-3 w-full bg-background-accent rounded-full overflow-hidden border border-luxury-gold/20">
								<div className="h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-dark" style={{ width: `${educationPct}%` }} />
							</div>
							<div className="flex items-center gap-3 mt-4">
								<LuxuryButton size="sm" onClick={completeLesson}>Mark Lesson Complete</LuxuryButton>
							</div>
						</LuxuryCard>

						<LuxuryCard variant="premium" className="p-6">
							<h3 className="text-text-primary font-semibold mb-2">New Wrapper This Month</h3>
							<p className="text-text-muted mb-4">Explore beyond your comfort zone at least once.</p>
							<div className="flex items-center gap-4">
								<button onClick={toggleNewWrapper} className={`px-4 py-2 rounded-luxury border transition-colors ${state.newWrapperThisMonth ? 'bg-luxury-gold text-background-primary border-luxury-gold' : 'border-text-muted/30 text-text-secondary hover:border-luxury-gold/50'}`}>
									{state.newWrapperThisMonth ? 'Completed ✅' : 'Mark as Done'}
								</button>
								<LuxuryButton variant="secondary" size="sm" onClick={resetProgress}>Reset</LuxuryButton>
							</div>
							<p className="text-xs text-text-muted mt-4">Last updated: {isReady ? new Date(state.lastUpdated).toLocaleString() : '—'}</p>
						</LuxuryCard>
					</div>
				</div>
			</section>
		</div>
	)
}