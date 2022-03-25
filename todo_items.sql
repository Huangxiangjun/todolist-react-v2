/*
Navicat MySQL Data Transfer

Source Server         : mydb
Source Server Version : 50730
Source Host           : localhost:3306
Source Database       : todolist

Target Server Type    : MYSQL
Target Server Version : 50730
File Encoding         : 65001

Date: 2022-03-25 13:36:55
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `todo_items`
-- ----------------------------
DROP TABLE IF EXISTS `todo_items`;
CREATE TABLE `todo_items` (
  `id` char(100) NOT NULL,
  `isCheck` int(1) NOT NULL,
  `text` varchar(1000) DEFAULT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of todo_items
-- ----------------------------
INSERT INTO `todo_items` VALUES ('1647781782115', '1', '参加一场音乐节', '2021-03-10 10:09:42');
INSERT INTO `todo_items` VALUES ('1647781790915', '0', '想要杰伦的签名！！！', '2021-10-01 21:09:50');
INSERT INTO `todo_items` VALUES ('1647782030893', '0', '去听一场五月天的演唱会', '2022-03-03 21:13:50');
INSERT INTO `todo_items` VALUES ('1647860059790', '0', '好好学习，天天向上', '2022-03-21 18:54:19');
INSERT INTO `todo_items` VALUES ('1647962919622', '0', '顺利毕业！！！', '2022-03-25 03:28:40');
INSERT INTO `todo_items` VALUES ('1647962951593', '0', '来一场断舍离', '2019-08-14 16:29:11');
INSERT INTO `todo_items` VALUES ('1647963082439', '1', '今年去学一样乐器', '2022-03-22 23:31:22');
