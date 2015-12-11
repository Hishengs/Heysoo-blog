<?php 
namespace Home\Model;
use Think\Model\RelationModel;
class PieceModel extends RelationModel {
	protected $_link = array(
		'PieceComment' => array(
			'mapping_type' => self::HAS_MANY,
			'class_name' => 'PieceComment',
			'mapping_name' => 'piece_comments',
			'foreign_key' => 'piece_id'
		),
		'User' => array(
			'mapping_type' => self::HAS_ONE,
			'class_name' => 'User',
			'mapping_name' => 'user',
			'foreign_key' => 'user_id'
		),
	);
}
?>