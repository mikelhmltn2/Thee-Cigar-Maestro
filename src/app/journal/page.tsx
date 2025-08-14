'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatedReveal, GoldGradientText, LuxuryButton, LuxuryCard } from '@/components/luxury'

interface JournalEntry {
	id: string
	date: string
	cigarName: string
	wrapper: string
	rating: number
	notes: string
}

const STORAGE_KEY = 'journal_entries_v1'

export default function JournalPage() {
	const [entries, setEntries] = useState<JournalEntry[]>([])
	const [draft, setDraft] = useState<Omit<JournalEntry, 'id'>>({
		date: new Date().toISOString().slice(0, 10),
		cigarName: '',
		wrapper: '',
		rating: 4,
		notes: '',
	})
	const [isReady, setIsReady] = useState(false)
	const [query, setQuery] = useState('')
	const [wrapperFilter, setWrapperFilter] = useState('')
	const [minRating, setMinRating] = useState(1)

	useEffect(() => {
		let isMounted = true
		;(async () => {
			try {
				const mod = await import('@/utils/storage.js')
				const storageManager = mod.default
				const saved = storageManager.getLocal(STORAGE_KEY)
				if (isMounted && Array.isArray(saved)) {
					setEntries(saved)
				}
			} catch (_e) {
				// ignore
			} finally {
				if (isMounted) setIsReady(true)
			}
		})()
		return () => {
			isMounted = false
		}
	}, [])

	const persist = async (next: JournalEntry[]) => {
		try {
			const mod = await import('@/utils/storage.js')
			await mod.default.setLocal(STORAGE_KEY, next)
			await mod.default.setIndexedDB('userData', { id: 'journal', data: next, updatedAt: Date.now() })
		} catch (_e) {
			// ignore
		}
	}

	const syncNow = async () => {
		await persist(entries)
	}

	const addEntry = async () => {
		if (!draft.cigarName.trim() || !draft.notes.trim()) return
		const next: JournalEntry = { id: `${Date.now()}`, ...draft }
		const updated = [next, ...entries]
		setEntries(updated)
		await persist(updated)
		setDraft({ ...draft, cigarName: '', notes: '' })
	}

	const removeEntry = async (id: string) => {
		const updated = entries.filter(e => e.id !== id)
		setEntries(updated)
		await persist(updated)
	}

	const filtered = useMemo(() => {
		return entries.filter(e => {
			if (wrapperFilter && e.wrapper !== wrapperFilter) return false
			if (e.rating < minRating) return false
			if (query && !(e.cigarName?.toLowerCase().includes(query.toLowerCase()) || e.notes?.toLowerCase().includes(query.toLowerCase()))) return false
			return true
		})
	}, [entries, query, wrapperFilter, minRating])

	const averageRating = useMemo(() => {
		if (filtered.length === 0) return 0
		return Math.round((filtered.reduce((s, e) => s + (e.rating || 0), 0) / filtered.length) * 10) / 10
	}, [filtered])

	return (
		<div className="min-h-screen pt-20 bg-gradient-to-br from-background-primary via-background-secondary to-background-accent">
			<section className="section-luxury">
				<div className="container-luxury">
					<AnimatedReveal>
						<h1 className="text-luxury-heading mb-4">Your <GoldGradientText>Journal</GoldGradientText></h1>
					</AnimatedReveal>
					<AnimatedReveal delay={0.1}>
						<p className="text-luxury-body max-w-3xl">Capture tasting notes, moments, and insights. Your entries are saved locally and never leave your device.</p>
					</AnimatedReveal>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
						<LuxuryCard variant="premium" className="p-6 lg:col-span-2">
							<h3 className="text-text-primary font-semibold mb-4">New Entry</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm text-text-muted mb-2">Date</label>
									<input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="input-luxury w-full" />
								</div>
								<div>
									<label className="block text-sm text-text-muted mb-2">Cigar</label>
									<input type="text" placeholder="e.g., Cohiba Behike 52" value={draft.cigarName} onChange={(e) => setDraft({ ...draft, cigarName: e.target.value })} className="input-luxury w-full" />
								</div>
								<div>
									<label className="block text-sm text-text-muted mb-2">Wrapper</label>
									<select value={draft.wrapper} onChange={(e) => setDraft({ ...draft, wrapper: e.target.value })} className="input-luxury w-full">
										<option value="">Select wrapper</option>
										<option>Maduro</option>
										<option>Connecticut</option>
										<option>Habano</option>
										<option>Natural</option>
										<option>Oscuro</option>
										<option>Candela</option>
									</select>
								</div>
								<div>
									<label className="block text-sm text-text-muted mb-2">Rating</label>
									<input type="range" min={1} max={5} step={1} value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: parseInt(e.target.value, 10) })} className="w-full" />
									<div className="text-sm text-text-muted">{draft.rating} / 5</div>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm text-text-muted mb-2">Notes</label>
									<textarea rows={5} placeholder="Aroma, draw, burn, flavors, moments..." value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className="textarea-luxury w-full" />
								</div>
							</div>
							<div className="mt-4 flex gap-3">
								<LuxuryButton onClick={addEntry}>Save Entry</LuxuryButton>
								<LuxuryButton variant="secondary" onClick={() => setDraft({ ...draft, cigarName: '', notes: '' })}>Clear</LuxuryButton>
							</div>
						</LuxuryCard>

						<LuxuryCard variant="premium" className="p-6">
							<h3 className="text-text-primary font-semibold mb-2">Stats</h3>
							<p className="text-text-muted">Entries: {filtered.length}</p>
							<p className="text-text-muted">Average Rating: {averageRating}</p>
							<div className="mt-4 flex gap-3">
								<LuxuryButton size="sm" variant="secondary" onClick={syncNow}>Sync Now</LuxuryButton>
							</div>
						</LuxuryCard>
					</div>

					<LuxuryCard variant="premium" className="p-6 mt-6">
						<h3 className="text-text-primary font-semibold mb-4">Filter & Search</h3>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<input placeholder="Search (cigar or notes)" value={query} onChange={(e) => setQuery(e.target.value)} className="input-luxury w-full" />
							<select value={wrapperFilter} onChange={(e) => setWrapperFilter(e.target.value)} className="input-luxury w-full">
								<option value="">Any wrapper</option>
								<option>Maduro</option>
								<option>Connecticut</option>
								<option>Habano</option>
								<option>Natural</option>
								<option>Oscuro</option>
								<option>Candela</option>
							</select>
							<div>
								<label className="block text-sm text-text-muted mb-2">Min Rating</label>
								<input type="range" min={1} max={5} step={1} value={minRating} onChange={(e) => setMinRating(parseInt(e.target.value, 10))} className="w-full" />
								<div className="text-sm text-text-muted">{minRating}+</div>
							</div>
							<div className="flex items-end">
								<LuxuryButton variant="secondary" onClick={() => { setQuery(''); setWrapperFilter(''); setMinRating(1); }}>Reset</LuxuryButton>
							</div>
						</div>
					</LuxuryCard>

					<div className="mt-6 space-y-6">
						{filtered.length === 0 && (
							<LuxuryCard className="p-6 text-text-muted">No entries match your filters.</LuxuryCard>
						)}
						{filtered.map(entry => (
							<LuxuryCard key={entry.id} variant="premium" className="p-6">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div>
										<h4 className="text-lg font-semibold text-text-primary">{entry.cigarName || 'Untitled'}</h4>
										<p className="text-sm text-text-muted">{entry.date} {entry.wrapper ? `• ${entry.wrapper}` : ''} • {entry.rating}/5</p>
									</div>
									<LuxuryButton variant="secondary" onClick={() => removeEntry(entry.id)}>Delete</LuxuryButton>
								</div>
								<p className="text-text-secondary mt-3 whitespace-pre-wrap">{entry.notes}</p>
							</LuxuryCard>
						))}
					</div>
				</div>
			</section>
		</div>
	)
}