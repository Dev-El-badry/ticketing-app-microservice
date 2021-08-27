import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/Header';

const AppComponent =  ({ Component, pageProps, currentUser }) => {
  return <div>
            <Header currentUser={currentUser} />
            <div className="container">
              <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>; 
};

AppComponent.getInitialProps = async appComponent => {
  const client = buildClient(appComponent.ctx);
  const {data} = await client.get('/api/users/currentuser');
  let pageProps = {};
  if(appComponent.Component.getInitialPage) {
    pageProps = await appComponent.Component.getInitialPage(appComponent.ctx, client, data.currentUser);
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponent;
