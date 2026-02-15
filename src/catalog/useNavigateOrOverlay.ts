import { useNavigation } from './NavigationContext';
import { useOverlay } from './OverlayContext';
import { useTree } from './TreeContext';
import { OVERLAY_TYPES } from './shared';

/**
 * Hook that provides a unified navigation handler for both view navigation and overlay opening
 * @returns A function that navigates to a view or opens an overlay based on the target type
 */
export function useNavigateOrOverlay() {
  const navigate = useNavigation();
  const { openOverlay } = useOverlay();
  const tree = useTree();

  return (navigateTo: string | undefined) => {
    if (!navigateTo) return;

    // Check if target is an overlay type
    const targetNode = tree?.get(navigateTo);
    const isOverlay = targetNode && OVERLAY_TYPES.includes(targetNode.type);

    if (isOverlay) {
      openOverlay(navigateTo);
    } else if (navigate) {
      navigate(navigateTo);
    }
  };
}
