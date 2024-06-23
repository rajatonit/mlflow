import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { IntlProvider } from 'react-intl';
import './index.css';
import { ApplyGlobalStyles } from '@databricks/design-system';
import '@databricks/design-system/dist/index.css';
import '@databricks/design-system/dist/index-dark.css';
import { Provider } from 'react-redux';
import store from './store';
import { useI18nInit } from './i18n/I18nUtils';
import { DesignSystemContainer } from './common/components/DesignSystemContainer';
import { ConfigProvider } from 'antd';
import { LegacySkeleton } from '@databricks/design-system';
// eslint-disable-next-line no-useless-rename
import { MlflowRouter as MlflowRouter } from './MlflowRouter';
import { useMLflowDarkTheme } from './common/hooks/useMLflowDarkTheme';

export function MLFlowRoot() {
  const search = window.location.search
  const params = new URLSearchParams(search);
  const jwt_token = params.get('jwt_token')

  if (jwt_token) sessionStorage.setItem('jwt_token', jwt_token)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const i18n = useI18nInit();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isDarkTheme, setIsDarkTheme, MlflowThemeGlobalStyles] = useMLflowDarkTheme();

  if (!i18n) {
    return (
      <DesignSystemContainer>
        <LegacySkeleton />
      </DesignSystemContainer>
    );
  }

  const { locale, messages } = i18n;

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Provider store={store}>
        <DesignSystemContainer isDarkTheme={isDarkTheme}>
          <ApplyGlobalStyles />
          <MlflowThemeGlobalStyles />
          <ConfigProvider prefixCls="ant">
            <MlflowRouter isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
          </ConfigProvider>
        </DesignSystemContainer>
      </Provider>
    </IntlProvider>
  );
}
