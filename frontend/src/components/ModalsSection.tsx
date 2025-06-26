import FilterModal, { FilterOptions } from './FilterModal'
import AuthModal from './AuthModal'

interface ModalsSectionProps {
  showFilterModal: boolean
  showAuthModal: boolean
  setShowFilterModal: (show: boolean) => void
  setShowAuthModal: (show: boolean) => void
  onApplyFilters: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

export default function ModalsSection({
  showFilterModal,
  showAuthModal,
  setShowFilterModal,
  setShowAuthModal,
  onApplyFilters,
  currentFilters
}: ModalsSectionProps) {
  return (
    <>
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={onApplyFilters}
        currentFilters={currentFilters}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
} 