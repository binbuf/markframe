import { type FC, type ReactNode } from 'react';
import type { MarkframeNode } from '../types/markframe';
import KButton from './KButton';
import KText from './KText';
import KInput from './KInput';
import KCard from './KCard';
import KNavbar from './KNavbar';
import KList from './KList';
import KSurface from './KSurface';
import KCheckbox from './KCheckbox';
import KRadio from './KRadio';
import KToggle from './KToggle';
import KTabs from './KTabs';
import KToolbar from './KToolbar';
import KTabbar from './KTabbar';
import KSegmented from './KSegmented';
import KListItem from './KListItem';
import KListGroup from './KListGroup';
import KListDivider from './KListDivider';
import KIcon from './KIcon';
import KFab from './KFab';
import KChip from './KChip';
import KBadge from './KBadge';
import KLink from './KLink';
import KBlock from './KBlock';
import KDivider from './KDivider';
import KSpacer from './KSpacer';
import KRow from './KRow';
import KColumn from './KColumn';
import KSheet from './KSheet';
import KPopup from './KPopup';
import KActions from './KActions';
import KDialog from './KDialog';
import KImage from './KImage';
import KProgressBar from './KProgressBar';
import KGrid from './KGrid';
import KAvatar from './KAvatar';
import KCenter from './KCenter';
import KMessage from './KMessage';
import KMediaCard from './KMediaCard';
import KStat from './KStat';
import KPost from './KPost';
import KIconCircle from './KIconCircle';
import KStoryRow from './KStoryRow';
import KStepper from './KStepper';
import KRange from './KRange';
import KToast from './KToast';
import KPreloader from './KPreloader';
import KPanel from './KPanel';
import KPopover from './KPopover';
import KMenuList from './KMenuList';
import KMenuItem from './KMenuItem';
import KBreadcrumbs from './KBreadcrumbs';
import KSearchbar from './KSearchbar';

export interface ComponentProps {
  node: MarkframeNode;
  children?: ReactNode;
  theme: 'ios' | 'material';
}

// No-op component for child types consumed by their parents (Dialog, Actions, Tabbar)
const KNoop: FC<ComponentProps> = () => null;

const catalog: Record<string, FC<ComponentProps>> = {
  Surface: KSurface,
  Button: KButton,
  Text: KText,
  TextField: KInput,
  Card: KCard,
  Navbar: KNavbar,
  List: KList,
  Checkbox: KCheckbox,
  Radio: KRadio,
  Switch: KToggle,
  Toggle: KToggle,
  Tabs: KTabs,
  Toolbar: KToolbar,
  Tabbar: KTabbar,
  Segmented: KSegmented,
  ListItem: KListItem,
  ListGroup: KListGroup,
  ListDivider: KListDivider,
  Icon: KIcon,
  Fab: KFab,
  Chip: KChip,
  Badge: KBadge,
  Link: KLink,
  Block: KBlock,
  Divider: KDivider,
  Spacer: KSpacer,
  Row: KRow,
  Column: KColumn,
  Sheet: KSheet,
  Popup: KPopup,
  Actions: KActions,
  Dialog: KDialog,
  Image: KImage,
  ProgressBar: KProgressBar,
  Grid: KGrid,
  Avatar: KAvatar,
  Center: KCenter,
  Message: KMessage,
  MediaCard: KMediaCard,
  Stat: KStat,
  Post: KPost,
  IconCircle: KIconCircle,
  StoryRow: KStoryRow,
  Stepper: KStepper,
  Range: KRange,
  Toast: KToast,
  Preloader: KPreloader,
  Panel: KPanel,
  Popover: KPopover,
  MenuList: KMenuList,
  MenuItem: KMenuItem,
  Breadcrumbs: KBreadcrumbs,
  Searchbar: KSearchbar,
  // Child types consumed by their parent components
  DialogButton: KNoop,
  ActionsButton: KNoop,
  ActionsGroup: KNoop,
  Tab: KNoop,
  Story: KNoop,
  BreadcrumbsItem: KNoop,
};

export default catalog;

