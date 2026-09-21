import { useState } from 'react'
import type { Item, Profile } from './data/types'
import { DEFAULT_PROFILE } from './data/types'
import {
  getProfile,
  getSavedOutfits,
  getWardrobe,
  setProfile as persistProfile,
  setSavedOutfits as persistSavedOutfits,
  setWardrobe as persistWardrobe,
} from './lib/storage'
import { buildExampleWardrobe } from './data/exampleWardrobe'
import NavBar, { type Page } from './components/NavBar'
import Onboarding from './pages/Onboarding'
import Wardrobe from './pages/Wardrobe'
import Generator from './pages/Generator'
import LinkBuilder from './pages/LinkBuilder'
import BuyCheck from './pages/BuyCheck'
import ColorCombos from './pages/ColorCombos'
import Saved from './pages/Saved'

export default function App() {
  const [profile, setProfileState] = useState<Profile>(() => getProfile())
  const [wardrobe, setWardrobeState] = useState<Item[]>(() => getWardrobe())
  const [savedOutfits, setSavedOutfitsState] = useState(() => getSavedOutfits())
  const [page, setPage] = useState<Page>('wardrobe')
  const [showOnboarding, setShowOnboarding] = useState(!profile.onboarded)

  function saveProfile(next: Profile) {
    setProfileState(next)
    persistProfile(next)
    setShowOnboarding(false)
  }

  function addItem(item: Item) {
    const next = [...wardrobe, item]
    setWardrobeState(next)
    persistWardrobe(next)
  }

  function updateItem(item: Item) {
    const next = wardrobe.map((i) => (i.id === item.id ? item : i))
    setWardrobeState(next)
    persistWardrobe(next)
  }

  function deleteItem(id: string) {
    const next = wardrobe.filter((i) => i.id !== id)
    setWardrobeState(next)
    persistWardrobe(next)
  }

  function loadExample() {
    const example = buildExampleWardrobe()
    setWardrobeState(example)
    persistWardrobe(example)
  }

  function toggleSaved(outfit: import('./data/types').Outfit) {
    const exists = savedOutfits.some((o) => o.id === outfit.id)
    const next = exists ? savedOutfits.filter((o) => o.id !== outfit.id) : [...savedOutfits, outfit]
    setSavedOutfitsState(next)
    persistSavedOutfits(next)
  }

  function removeSaved(id: string) {
    const next = savedOutfits.filter((o) => o.id !== id)
    setSavedOutfitsState(next)
    persistSavedOutfits(next)
  }

  if (showOnboarding) {
    return (
      <div className="min-h-svh bg-neutral-50 dark:bg-neutral-950">
        <Onboarding initial={profile.onboarded ? profile : DEFAULT_PROFILE} onSave={saveProfile} />
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-neutral-50 dark:bg-neutral-950">
      <NavBar page={page} onNavigate={setPage} onEditProfile={() => setShowOnboarding(true)} />

      {page === 'wardrobe' && (
        <Wardrobe wardrobe={wardrobe} onAdd={addItem} onUpdate={updateItem} onDelete={deleteItem} onLoadExample={loadExample} />
      )}

      {page === 'generator' && (
        <Generator
          wardrobe={wardrobe}
          profile={profile}
          savedOutfits={savedOutfits}
          onToggleSaved={toggleSaved}
          onGoToWardrobe={() => setPage('wardrobe')}
        />
      )}

      {page === 'link-builder' && <LinkBuilder profile={profile} />}

      {page === 'buy-check' && <BuyCheck wardrobe={wardrobe} onAddToWardrobe={addItem} />}

      {page === 'colors' && <ColorCombos />}

      {page === 'saved' && <Saved wardrobe={wardrobe} savedOutfits={savedOutfits} onRemove={removeSaved} />}
    </div>
  )
}
