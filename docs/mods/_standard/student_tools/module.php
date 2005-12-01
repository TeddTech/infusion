<?php
if (!defined('AT_INCLUDE_PATH')) { exit; }
if (!isset($this) || (isset($this) && (strtolower(get_class($this)) != 'module'))) { exit(__FILE__ . ' is not a Module'); }

define('AT_PRIV_STYLES', $this->getPrivilege());

$this->_pages['tools/modules.php']['title_var'] = 'student_tools';
$this->_pages['tools/modules.php']['parent']    = 'tools/index.php';
$this->_pages['tools/modules.php']['children']  = array('tools/side_menu.php');
$this->_pages['tools/modules.php']['guide']     = 'instructor/?p=14.0.student_tools.php';

	$this->_pages['tools/side_menu.php']['title_var'] = 'side_menu';
	$this->_pages['tools/side_menu.php']['parent']    = 'tools/modules.php';
	$this->_pages['tools/side_menu.php']['guide']     = 'instructor/?p=14.1.side_menu.php';

?>