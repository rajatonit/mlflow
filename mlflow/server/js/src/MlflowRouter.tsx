import React, { useMemo } from 'react';
import { LegacySkeleton } from '@databricks/design-system';

import ErrorModal from './experiment-tracking/components/modals/ErrorModal';
import AppErrorBoundary from './common/components/error-boundaries/AppErrorBoundary';
import { HashRouter, Route, Routes, createLazyRouteElement } from './common/utils/RoutingUtils';
import { MlflowHeader } from './common/components/MlflowHeader';

// Route definition imports:
import { getRouteDefs as getExperimentTrackingRouteDefs } from './experiment-tracking/route-defs';
import { getRouteDefs as getModelRegistryRouteDefs } from './model-registry/route-defs';
import { getRouteDefs as getCommonRouteDefs } from './common/route-defs';
import { useInitializeExperimentRunColors } from './experiment-tracking/components/experiment-page/hooks/useExperimentRunColor';

// console.log(process.env.HIDE_HEADER )

/**
 * This is the MLflow default entry/landing route.
 */
const landingRoute = {
  path: '/',
  element: createLazyRouteElement(() => import('./experiment-tracking/components/HomePage')),
  pageId: 'mlflow.experiments.list',
};

export const MlflowRouter = ({
  isDarkTheme,
  setIsDarkTheme,
  hideHeader
}: {
  isDarkTheme?: boolean;
  setIsDarkTheme?: (isDarkTheme: boolean) => void;
  hideHeader?: string;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useInitializeExperimentRunColors();
  // @ts-expect-error TS(4111): Property 'HIDE_HEADER' comes from an index signature, so ... Remove this comment to see the full error message
  hideHeader = process.env.HIDE_HEADER;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routes = useMemo(
    () => [...getExperimentTrackingRouteDefs(), ...getModelRegistryRouteDefs(), landingRoute, ...getCommonRouteDefs()],
    [],
  );
  return (
    <>
      <ErrorModal />
      <HashRouter>
        <AppErrorBoundary>
          {
            hideHeader == 'flase' 
            ? <MlflowHeader isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
            : null
          }
            
          <React.Suspense fallback={<LegacySkeleton />}>
            <Routes>
              {routes.map(({ element, pageId, path }) => (
                <Route key={pageId} path={path} element={element} />
              ))}
            </Routes>
          </React.Suspense>
        </AppErrorBoundary>
      </HashRouter>
    </>
  );
};
