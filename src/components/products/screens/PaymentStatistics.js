import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import {getPaymentStatistics} from '../ProductsHTTP';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const screenWidth = Dimensions.get('window').width;

const PaymentStatistics = ({navigation}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('day'); // State để quản lý tab

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPaymentStatistics();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatShortAmount = value => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'k';
    }
    return value.toString();
  };

  // Hàm format tiền đầy đủ (VD: 150000 -> 150.000 VND)
  const formatFullAmount = value => {
    return value.toLocaleString('vi-VN') + ' VND'; // VD: 150.000 VND
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không có dữ liệu</Text>
      </View>
    );
  }

  const chartData = {
    day: {
      title: 'Theo Ngày',
      labels: data.byDay.map(item =>
        new Date(item.date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
        }),
      ),
      data: data.byDay.map(item => item.totalAmount),
      description: data.byDay.map(
        item =>
          `Ngày ${new Date(item.date).toLocaleDateString(
            'vi-VN',
          )}: ${formatFullAmount(item.totalAmount)}`,
      ),
    },
    week: {
      title: 'Theo Tuần',
      labels: data.byWeek.map(item => `Tuần ${item.week}`),
      data: data.byWeek.map(item => item.totalAmount),
      description: data.byWeek.map(
        item => `Tuần ${item.week}: ${formatFullAmount(item.totalAmount)}`,
      ),
    },
    month: {
      title: 'Theo Tháng',
      labels: data.byMonth.map(item => `Tháng ${item.month}`),
      data: data.byMonth.map(item => item.totalAmount),
      description: data.byMonth.map(
        item => `Tháng ${item.month}: ${formatFullAmount(item.totalAmount)}`,
      ),
    },
    year: {
      title: 'Theo Năm',
      labels: data.byYear.map(item => `${item.year}`),
      data: data.byYear.map(item => item.totalAmount),
      description: data.byYear.map(
        item => `Năm ${item.year}: ${formatFullAmount(item.totalAmount)}`,
      ),
    },
  };

  const renderChart = (title, labels, data, description) => {
    const chartWidth = screenWidth - 50;
    const barWidth = chartWidth / labels.length;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <ScrollView horizontal>
          <BarChart
            data={{
              labels,
              datasets: [
                {
                  data,
                },
              ],
            }}
            width={Math.max(screenWidth, labels.length * 50)} // Đảm bảo chiều rộng đủ để hiển thị tất cả các cột
            height={250}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 2,
              // màu cam theo theme của ứng dụng
              color: (opacity = 1) => `rgba(232, 144, 12, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                strokeWidth: 0,
              },
            }}
            style={{
              marginVertical: 16,
              borderRadius: 16,
            }}
            fromZero
            formatYLabel={value => formatShortAmount(parseInt(value))}
          />
        </ScrollView>
        <Text style={styles.descriptionText}>Chi tiết:</Text>
        <View style={styles.descriptionContainer}>
          {description.map((desc, index) => (
            <Text key={index} style={styles.descriptionText}>
              {desc}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
          style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrowleft" size={24} color="#E8900C" />
            </TouchableOpacity>
            <Text style={styles.headerText}>THỐNG KÊ THANH TOÁN</Text>
          </View>

          {/* Tab Section */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'day' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('day')}>
              <Text style={styles.tabText}>Ngày</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'week' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('week')}>
              <Text style={styles.tabText}>Tuần</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'month' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('month')}>
              <Text style={styles.tabText}>Tháng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'year' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('year')}>
              <Text style={styles.tabText}>Năm</Text>
            </TouchableOpacity>
          </View>

          {/* Chart */}
          {renderChart(
            chartData[activeTab].title,
            chartData[activeTab].labels,
            chartData[activeTab].data,
            chartData[activeTab].description,
          )}
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: hp(8),
    width: wp(100),
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 3,
    paddingHorizontal: 10,
    gap: 20,
  },
  headerText: {
    fontSize: hp(2),
    fontWeight: '500',
    color: '#E8900C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  chartContainer: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 13,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#E8900C',
  },
  descriptionContainer: {
    padding: 8,
    marginTop: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E8900C',
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#F6F6F6',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
});

export default PaymentStatistics;
