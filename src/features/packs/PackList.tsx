import { memo, useMemo } from 'react';
import { FlatList, ListRenderItem, Platform, useWindowDimensions, View } from 'react-native';
import PackCard from './PackCard';
import type { Pack } from './types';

export default memo(function PackList({
  packs,
  onPressPack,
  onPressCTA,
  listHeader,
}: {
  packs: Pack[];
  onPressPack?: (p: Pack) => void;
  onPressCTA?: (p: Pack) => void;
  listHeader?: React.ReactElement | null;
}) {
  const { width } = useWindowDimensions();
  const numColumns = useMemo(() => {
    if (Platform.OS === 'web') {
      if (width >= 1024) return 3;
      if (width >= 700) return 2;
    }
    return 1;
  }, [width]);

  const renderItem: ListRenderItem<Pack> = ({ item }) => (
    <View className={"p-2"} style={numColumns > 1 ? { width: `${100 / numColumns}%` } : undefined}>
      <PackCard
        pack={item}
        onPress={() => onPressPack?.(item)}
        onPressCTA={() => onPressCTA?.(item)}
      />
    </View>
  );

  return (
    <FlatList
      data={packs}
      key={numColumns} // force relayout when columns change
      keyExtractor={(p) => p.id}
      renderItem={renderItem}
      numColumns={numColumns}
      ListHeaderComponent={listHeader ? (() => <View className={numColumns > 1 ? 'px-2' : ''}>{listHeader}</View>) : undefined}
      contentContainerStyle={{ padding: 8, paddingBottom: 24 }}
    />
  );
});
