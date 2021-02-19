import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import AudioList from './app/screens/AudioList';
import Screen from './app/screens/Screen';

let arr = [];
for (let i = 1; i < 300; i++) {
  arr.push(`Item no: ${i}`);
}

let lastItem = '';

const fakeServer = qty =>
  new Promise((resolve, reject) => {
    let newArr;
    const lastItemIndex = arr.indexOf(lastItem);
    if (lastItemIndex === arr.length - 1) return;

    if (!lastItem) {
      newArr = [...arr].slice(0, qty);
      lastItem = [...newArr].pop();
    } else {
      const newIndex = arr.indexOf(lastItem) + 1;
      newArr = [...arr].slice(newIndex, qty + newIndex);
      lastItem = [...newArr].pop();
    }
    // console.log('newArr', newArr);
    setTimeout(() => {
      resolve(newArr);
    }, 1000);
  });

const renderItem = ({ item }) => (
  <Text
    style={{
      textAlign: 'center',
      fontSize: 20,
      padding: 5,
      borderBottomColor: 'red',
      borderBottomWidth: 1,
    }}
  >
    {item}
  </Text>
);

const FooterComponent = () => (
  <Text
    style={{
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 2,
      padding: 5,
    }}
  >
    Loading...
  </Text>
);

export default function App() {
  let onMomentumScrollBegin = true;
  // return (
  //   <Screen>
  //     <AudioList />
  //   </Screen>
  // );

  // react native flatlist load more on scroll

  const [data, setData] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  // const [onMomentumScrollBegin, setOnMomentumScrollBegin] = useState(true)

  const fetchData = async qty => {
    const data = await fakeServer(qty);
    setData([...data]);
  };

  useEffect(() => {
    fetchData(20);
  }, []);

  const fetchMoreData = async () => {
    if (!onMomentumScrollBegin) {
      setLoadingMore(true);
      const newData = await fakeServer(20);
      setData([...data, ...newData]);
      onMomentumScrollBegin = true;
      setLoadingMore(false);
    } else {
      setLoadingMore(false);
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 40 }}>
      <FlatList
        data={data}
        keyExtractor={item => item}
        renderItem={renderItem}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.01}
        initialNumToRender={20}
        onMomentumScrollBegin={() => {
          onMomentumScrollBegin = false;
        }}
        ListFooterComponent={() => loadingMore && <FooterComponent />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
