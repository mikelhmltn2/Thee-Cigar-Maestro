'use client'

import { useEffect, useState } from 'react'

const LOADING_ID = 'dataManager_loadAll'

export default function TopProgressBar() {
	const [progress, setProgress] = useState(0)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		let mounted = true
		let cleanup: (() => void) | null = null
		;(async () => {
			try {
				const mod = await import('@/components/LoadingSystem.js')
				const loadingSystem = mod.default as any
				const state = loadingSystem.getLoadingState?.(LOADING_ID)
				if (mounted && state) {
					setProgress(Math.round(state.progress ?? 0))
					setVisible(true)
				}
				loadingSystem.setCallback?.(LOADING_ID, {
					onProgress: (p: number) => {
						if (!mounted) return
						setVisible(true)
						setProgress(Math.round(p))
					},
					onSuccess: () => {
						if (!mounted) return
						setProgress(100)
						setTimeout(() => { if (mounted) setVisible(false) }, 600)
					},
					onError: () => {
						if (!mounted) return
						setVisible(false)
					},
				})
				cleanup = () => loadingSystem.setCallback?.(LOADING_ID, {})
			} catch (_e) {
				// ignore if loading system not available
			}
		})()
		return () => {
			mounted = false
			if (cleanup) cleanup()
		}
	}, [])

	if (!visible) return null

	return (
		<div className="fixed top-0 left-0 right-0 z-[60]">
			<div className="h-1 w-full bg-background-secondary/60">
				<div
					className="h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-dark transition-all duration-200"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	)
}